call uglifyjs dist/liefs-layout-managerV3_CORE.js > dist/liefs-layout-managerV3_CORE.min.js
call uglifyjs dist/liefs-layout-managerV3_FULL.js > dist/liefs-layout-managerV3_FULL.min.js
call uglifyjs dist/components/Context.js > dist/components/Context.min.js
call uglifyjs dist/components/DragBar.js > dist/components/DragBar.min.js
call uglifyjs dist/components/Modal.js > dist/components/Modal.min.js
call uglifyjs dist/components/Pages.js > dist/components/Pages.min.js
call uglifyjs dist/components/Scrollbar.js > dist/components/Scrollbar.min.js
call uglifyjs dist/components/Selected.js > dist/components/Selected.min.js
call uglifyjs dist/components/Tree.js > dist/components/Tree.min.js
call copy dist\liefs-layout-managerV3_FULL.js dist\liefs-layout-managerV3_FULL_MODULE.js
call type MakeModule.js >> dist/liefs-layout-managerV3_FULL_MODULE.js
call webpack
call uglifyjs dist/liefs-layout-managerV3_SCOPED.js > dist/liefs-layout-managerV3_SCOPED.min.js
call mkdir ..\V3.0.1.npm\dist
call copy dist\*.* ..\V3.0.1.npm\dist
call mkdir ..\V3.0.1.npm\dist\components
call copy dist\components\*.* ..\V3.0.1.npm\dist\components
call mkdir ..\V3.0.1.npm\src
call mkdir ..\V3.0.1.npm\src\components
call copy src\components\*.* ..\V3.0.1.npm\src\components
call mkdir ..\V3.0.1.npm\src\core
call copy src\core\*.* ..\V3.0.1.npm\src\core
call copy dist\liefs-layout-managerV3_FULL_MODULE.js ..\V3.0.1.npm\index.js
call mkdir ..\V3.0.1.npm\Examples
call copy Examples\*.* ..\V3.0.1.npm\Examples
call copy README.md ..\V3.0.1.npm
