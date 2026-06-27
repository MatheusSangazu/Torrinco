import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma.js';
import type { JwtRequest } from '../middleware/jwt.js';
import * as XLSX from 'xlsx';
import { EvolutionService } from '../services/evolution.service.js';

export class ExportController {
  static async exportToExcel(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { start_date, end_date, type, category, status } = req.query;
      const userId = req.userId!;

      const where: any = {
        user_id: userId,
        deleted_at: null
      };

      if (start_date || end_date) {
        where.transaction_date = {};
        if (start_date) where.transaction_date.gte = new Date(start_date as string);
        if (end_date) where.transaction_date.lte = new Date(end_date as string);
      }

      if (type) where.type = type;
      if (category) where.category = category;
      if (status) where.status = status;

      const transactions = await prisma.transactions.findMany({
        where,
        include: {
          categories: true,
          financial_entities: true,
          accounts: true
        },
        orderBy: {
          transaction_date: 'desc'
        }
      });

      const data = transactions.map(t => {
        const installmentInfo = t.installment_id && t.installment_number
          ? `Parcela ${t.installment_number}`
          : '-';

        return {
          'ID': t.id,
          'Data': new Date(t.transaction_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          'Descrição': t.description || '-',
          'Categoria': t.categories?.name || t.category || '-',
          'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
          'Valor': Number(t.amount),
          'Status': t.status === 'paid' ? 'Pago' : 'Pendente',
          'Entidade': t.financial_entities?.name || '-',
          'Conta': t.accounts?.name || '-',
          'Recorrente': t.is_recurring ? 'Sim' : 'Não',
          'Parcelamento': installmentInfo
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      const colWidths = [
        { wch: 10 },
        { wch: 15 },
        { wch: 40 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 }
      ];

      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

      const fileName = `transacoes_torrinco_${new Date().toISOString().split('T')[0]}.xlsx`;

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      res.send(buffer);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      next(error);
    }
  }

  static async sendReportToWhatsApp(req: JwtRequest, res: Response, next: NextFunction) {
    try {
      const { start_date, end_date, type, category, status } = req.query;
      const userId = req.userId!;

      const user = await prisma.users.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const where: any = {
        user_id: userId,
        deleted_at: null
      };

      if (start_date || end_date) {
        where.transaction_date = {};
        if (start_date) where.transaction_date.gte = new Date(start_date as string);
        if (end_date) where.transaction_date.lte = new Date(end_date as string);
      }

      if (type) where.type = type;
      if (category) where.category = category;
      if (status) where.status = status;

      const transactions = await prisma.transactions.findMany({
        where,
        include: {
          categories: true,
          financial_entities: true,
          accounts: true
        },
        orderBy: {
          transaction_date: 'desc'
        }
      });

      if (transactions.length === 0) {
        return res.json({ message: 'No transactions found', success: true });
      }

      const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const balance = totalIncome - totalExpense;

      const formatDate = (date: Date) => new Date(date).toLocaleDateString('pt-BR');
      const formatCurrency = (value: number) => 
        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

      let report = `*📊 RELATÓRIO FINANCEIRO - TORRINCO*\n\n`;
      
      report += `👤 Usuário: ${user.name}\n`;
      report += `📅 Período: ${start_date || 'Início'} a ${end_date || 'Hoje'}\n\n`;

      report += `*💰 RESUMO*\n`;
      report += `▪️ Receitas: ${formatCurrency(totalIncome)}\n`;
      report += `▪️ Despesas: ${formatCurrency(totalExpense)}\n`;
      report += `▪️ Saldo: ${formatCurrency(balance)}\n\n`;

      report += `*📋 TRANSAÇÕES (${transactions.length})*\n\n`;

      transactions.forEach((t, index) => {
        const emoji = t.type === 'income' ? '💵' : '💸';
        const statusEmoji = t.status === 'paid' ? '✅' : '⏳';
        const date = new Date(t.transaction_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        const amount = Number(t.amount).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
        const category = t.categories?.name || t.category || '-';
        const entity = t.financial_entities?.name || '-';

        let installmentText = '';
        if (t.installment_id && t.installment_number) {
          installmentText = ` | 📦 Parcela ${t.installment_number}`;
        }

        report += `${index + 1}. ${emoji} ${t.description || '-'}\n`;
        report += `   📅 ${date} | 💲 ${amount}${installmentText}\n`;
        report += `   🏷️ ${category} | 🏦 ${entity} ${statusEmoji}\n\n`;
      });

      report += `📌 Total de ${transactions.length} transações\n`;
      report += `⏰ Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n`;
      report += `🔒 *Relatório confidencial - Torrinco*`;

      const data = transactions.map(t => {
        const installmentInfo = t.installment_id && t.installment_number
          ? `Parcela ${t.installment_number}`
          : '-';

        return {
          'ID': t.id,
          'Data': new Date(t.transaction_date).toLocaleDateString('pt-BR', { timeZone: 'UTC' }),
          'Descrição': t.description || '-',
          'Categoria': t.categories?.name || t.category || '-',
          'Tipo': t.type === 'income' ? 'Receita' : 'Despesa',
          'Valor': Number(t.amount),
          'Status': t.status === 'paid' ? 'Pago' : 'Pendente',
          'Entidade': t.financial_entities?.name || '-',
          'Conta': t.accounts?.name || '-',
          'Recorrente': t.is_recurring ? 'Sim' : 'Não',
          'Parcelamento': installmentInfo
        };
      });

      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(data);

      const colWidths = [
        { wch: 10 },
        { wch: 15 },
        { wch: 40 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 },
        { wch: 12 },
        { wch: 25 },
        { wch: 20 },
        { wch: 12 },
        { wch: 15 }
      ];

      worksheet['!cols'] = colWidths;

      XLSX.utils.book_append_sheet(workbook, worksheet, 'Transações');

      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      console.log(`📊 Excel gerado. Tamanho: ${buffer.length} bytes`);

      const base64 = Buffer.from(buffer).toString('base64');
      const fileName = `transacoes_torrinco_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      const caption = `📊 *Relatório Financeiro - Torrinco*\n\n📅 Período: ${start_date || 'Início'} a ${end_date || 'Hoje'}\n📊 Total de ${transactions.length} transações\n⏰ Gerado em: ${new Date().toLocaleString('pt-BR')}\n\n🔒 Relatório confidencial`;

      console.log('📱 Enviando texto para WhatsApp...');
      const textResult = await EvolutionService.sendText(user.phone_number, report);
      
      console.log('⏳ Aguardando 1.5s antes de enviar documento...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('📄 Enviando documento para WhatsApp...');
      const docResult = await EvolutionService.sendDocument(user.phone_number, base64, fileName, caption);
      console.log('📄 Resultado do envio do documento:', docResult ? 'Sucesso' : 'Falha');

      if (textResult || docResult) {
        res.json({ 
          message: 'Report and Excel sent successfully', 
          success: true,
          transactionCount: transactions.length 
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to send report or Excel', 
          success: false 
        });
      }
    } catch (error) {
      console.error('Erro ao enviar relatório para WhatsApp:', error);
      next(error);
    }
  }
}
