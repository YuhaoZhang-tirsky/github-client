const axios = require('axios')

const github_base_url = 'https://api.github.com'

const requestGithub = async (method, url, data, headers) => {
  try {
    return await axios({
      method,
      url: `${github_base_url}${url}`,
      data,
      headers
    })
  } catch (error) {
    return { data: 'no data' }
  }
}

const isServer = typeof window === 'undefined'

const request = async ({ method = 'GET', url, data = {} }, req, res) => {
  if (!url) {
    throw Error('Must provide a url')
  }
  if (isServer) {
    const githubAuth = req.session.githubAuth || {}
    let headers = {}
    if (githubAuth.access_token) {
      headers['Authorization'] = `${githubAuth.token_type} ${githubAuth.access_token}`
    }
    return await requestGithub(method, url, data, headers)
  } else {
    try {
      return await axios({
        method,
        url: `/github${url}`,
        data
      })
    } catch (error) {
      return { data: 'no data' }
    }
  }
}

module.exports = {
  request,
  requestGithub
}

