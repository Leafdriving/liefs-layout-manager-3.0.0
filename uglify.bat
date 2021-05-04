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