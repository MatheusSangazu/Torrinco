import { Component, type ErrorInfo, type ReactNode } from 'react';
export class ErrorBoundary extends Component<{children:ReactNode},{hasError:boolean}> {
  state={hasError:false};
  static getDerivedStateFromError(){return{hasError:true}}
  componentDidCatch(error:Error,info:ErrorInfo){console.error('Erro não tratado na interface',{error,componentStack:info.componentStack})}
  render(){if(this.state.hasError)return <main className="flex min-h-screen items-center justify-center bg-gray-50 p-6"><div className="max-w-md rounded-2xl bg-white p-8 text-center shadow"><h1 className="text-2xl font-bold">Algo deu errado</h1><p className="mt-2 text-gray-600">Seus dados não foram alterados. Recarregue a página para tentar novamente.</p><button onClick={()=>window.location.reload()} className="mt-6 rounded-xl bg-torrinco-600 px-5 py-3 font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-torrinco-600">Recarregar</button></div></main>;return this.props.children}
}
