const { override, fixBabelImports, addLessLoader } = require('customize-cra');

// Override and add antd
module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: { '@primary-color': '#4094ED' }
    })
);
