
const dev = process.env.NODE_ENV !== 'production'

export default {
  mode: 'spa',
  head: {
    title: '接待オセロ',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  pageTransition: 'page',
  loading: { color: '#fff' },
  css: [
    "@/assets/main.css"
  ],
  plugins: [
  ],
  buildModules: [
    '@nuxt/typescript-build'
  ],
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/netlify-files'
  ],
  axios: {
    baseURL: (dev ? "http://localhost:5050" : "https://othello-254918.appspot.com")
  },
  build: {
    extend(config, ctx) {
    }
  }
}
