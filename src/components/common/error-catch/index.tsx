import React from 'react'

class ErrorBoundary extends React.Component<any, any> {
  constructor(props: unknown) {
    super(props)
    this.state = { error: false, errorInfo: false }
  }

  componentDidCatch(error: unknown, errorInfo: unknown): void {
    this.setState({
      error,
      errorInfo
    })
  }

  render(): JSX.Element {
    if (this.state.errorInfo) {
      // 出错
      return <div>
        <div>哎呀～出错啦！</div>
      </div>
    }
    // 正常页面，渲染子组件
    return <>
      {this.props.children}
    </>
  }
}
export default ErrorBoundary
