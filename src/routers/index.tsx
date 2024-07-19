import React, { Suspense } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import ErrorBoundary from '@/components/common/error-catch'
import routes from './routers'
import MainLayout from '@/components/layout/mainLayout'
import { CsrfProvider } from './csrf-context'

const getRouteContent = (route: any) => {
  const { layout, meta, component: Component } = route
  let layoutComponent = null
  switch (layout) {
    case 'main':
      layoutComponent = (
        <MainLayout>
          <Content meta={meta} Component={Component} />
        </MainLayout>
      )
      break
    default:
      layoutComponent = (
        <Content meta={meta} Component={Component} />
      )
  }
  return (
    <CsrfProvider>
      {layoutComponent}
    </CsrfProvider>
  )
}

const Content = ({ meta, Component }: any) => (
  <>
    {meta && <Helmet>
      <meta charSet="utf-8" />
      {meta?.title && <title>{meta.title}</title>}
      {meta?.description && <meta name="description" content={meta.description} />}
    </Helmet>}
    <Component meta={meta} />
  </>
)

const getRoutes = () => {
  const routeDom = (<Routes>
    {
      routes.map((route, index) => (
        <Route
          key={index}
          path={route.path}
          element={getRouteContent(route)}
        />
      ))
    }
    <Route path='*' element={<MainLayout />} />
  </Routes>)
  return routeDom
}

const BasicRoute = (): JSX.Element => (
  <ErrorBoundary>
    <HelmetProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          {getRoutes()}
        </Suspense>
      </BrowserRouter>
    </HelmetProvider>
  </ErrorBoundary>
)
export default BasicRoute
