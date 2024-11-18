import { definePlasmoConfig } from 'plasmo'

export default definePlasmoConfig({

  webpack: (config) => {

    config.module.rules.push({
      test: /\.ts$/,
      include: /processors/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-typescript']
        }
      }
    })
    return config
  }
})
