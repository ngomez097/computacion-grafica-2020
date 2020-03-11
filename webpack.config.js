const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    index: './src/index.js',
    twgl: './src/samples/twgl/example/index.js',
    twglBasic: './src/samples/twgl/basic/index.js',
    reglMesh: './src/samples/regl/mesh',
    twglDatGui: './src/samples/twgl/dat.gui/index.js',
    twglGlMatrix: './src/samples/twgl/gl-matrix/index.js',
    twglVao: './src/samples/twgl/vao/index.js',
    twglTexture: './src/samples/twgl/texture',
    twglPrograms: './src/samples/twgl/programs',
    twglPicking: './src/samples/twgl/picking',
    reglBasic: './src/samples/regl/basic',
    reglDatGui: './src/samples/regl/dat.gui',
    reglPicking: './src/samples/regl/picking',
    reglContext: './src/samples/regl/context',
    reglTexture: './src/samples/regl/texture',
    reglPrograms: './src/samples/regl/programs',
    reglMatrixStack: './src/samples/regl/matrix-stack',
    webgl00: './src/samples/webgl/00-point',
    webgl01: './src/samples/webgl/01-points',
    webgl02: './src/samples/webgl/02-colored-points',
    webgl03: './src/samples/webgl/03-indexed-colored-points',
    webgl04: './src/samples/webgl/04-uniform-colored-points',
    webgl05: './src/samples/webgl/05-triangle-and-square',
    webgl061: './src/samples/webgl/06-translate-triangle-and-square',
    webgl062: './src/samples/webgl/06-translate-triangle-and-square/index-with-dat.gui.js',
    webgl071: './src/samples/webgl/07-textures',
    webgl072: './src/samples/webgl/07-textures/two-textures.js',
    webgl08: './src/samples/webgl/08-dom-events',
    tp01: './src/tp01',
    tp02: './src/tp02',
    tp03: './src/tp03',
    tp04: './src/tp04',
    tp05: './src/tp05',
    tp06: './src/tp06',
    vendor: ['twgl.js', 'regl', 'gl-matrix', 'dat.gui']
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    port: 9000
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      title: 'WebGL App',
      chunks: ['vendor', 'index']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Point',
      filename: 'webgl00.html',
      chunks: ['vendor', 'webgl00']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Points',
      filename: 'webgl01.html',
      chunks: ['vendor', 'webgl01']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Colored Points',
      filename: 'webgl02.html',
      chunks: ['vendor', 'webgl02']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Indexed Points',
      filename: 'webgl03.html',
      chunks: ['vendor', 'webgl03']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Uniform Colored Points',
      filename: 'webgl04.html',
      chunks: ['vendor', 'webgl04']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Triangle and Square',
      filename: 'webgl05.html',
      chunks: ['vendor', 'webgl05']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Translate Triangle and Square',
      filename: 'webgl061.html',
      chunks: ['vendor', 'webgl061']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Translate Triangle and Square',
      filename: 'webgl062.html',
      chunks: ['vendor', 'webgl062']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Textures',
      filename: 'webgl071.html',
      chunks: ['vendor', 'webgl071']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - Textures',
      filename: 'webgl072.html',
      chunks: ['vendor', 'webgl072']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - DOM Events',
      filename: 'webgl08.html',
      chunks: ['vendor', 'webgl08']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl',
      filename: 'twgl.html',
      chunks: ['vendor', 'twgl']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl-basic',
      filename: 'twgl-basic.html',
      chunks: ['vendor', 'twglBasic']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + dat.gui',
      filename: 'twgl-dat-gui.html',
      chunks: ['vendor', 'twglDatGui']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + gl-matrix',
      filename: 'twgl-gl-matrix.html',
      chunks: ['vendor', 'twglGlMatrix']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + VAO',
      filename: 'twgl-vao.html',
      chunks: ['vendor', 'twglVao']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + Texture',
      filename: 'twgl-texture.html',
      chunks: ['vendor', 'twglTexture']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + Programs',
      filename: 'twgl-programs.html',
      chunks: ['vendor', 'twglPrograms']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - twgl + Picking',
      filename: 'twgl-picking.html',
      chunks: ['vendor', 'twglPicking']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl-basic',
      filename: 'regl-basic.html',
      chunks: ['vendor', 'reglBasic']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl-mesh',
      filename: 'regl-mesh.html',
      chunks: ['vendor', 'reglMesh']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + dat.gui',
      filename: 'regl-dat-gui.html',
      chunks: ['vendor', 'reglDatGui']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + Texture',
      filename: 'regl-texture.html',
      chunks: ['vendor', 'reglTexture']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + Programs',
      filename: 'regl-programs.html',
      chunks: ['vendor', 'reglPrograms']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + Picking',
      filename: 'regl-picking.html',
      chunks: ['vendor', 'reglPicking']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + Context',
      filename: 'regl-context.html',
      chunks: ['vendor', 'reglContext']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - regl + MatrixStack',
      filename: 'regl-matrix-stack.html',
      chunks: ['vendor', 'reglMatrixStack']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-jasmine.html'),
      title: 'WebGL - TP01',
      filename: 'tp01.html',
      chunks: ['vendor', 'tp01']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - TP02',
      filename: 'tp02.html',
      chunks: ['vendor', 'tp02']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - TP03',
      filename: 'tp03.html',
      chunks: ['vendor', 'tp03']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - TP04',
      filename: 'tp04.html',
      chunks: ['vendor', 'tp04']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - TP05',
      filename: 'tp05.html',
      chunks: ['vendor', 'tp05']
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index-canvas.html'),
      title: 'WebGL - TP06',
      filename: 'tp06.html',
      chunks: ['vendor', 'tp06']
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(glsl|obj)$/,
        use: ['raw-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: ['file-loader']
      }
    ]
  }
}
