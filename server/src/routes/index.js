
const express = require('express')
const imagens = require('./imagensRoutes')

module.exports = app => {
  app.use(express.json(),
          express.urlencoded({ extended: false }),
          imagens,      
          )  
}