function getQueryPrams (search: string = location.search): { [key: string]: any } {
  const str = (search || '').replace('?', '')
  const query: { [key: string]: unknown } = {}
  str.split('&').map((item: string) => {
    const [key, value] = item.split('=')
    query[key] = value
    return item
  })
  return query
}

export {
  getQueryPrams
}
