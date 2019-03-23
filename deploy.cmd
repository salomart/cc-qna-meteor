meteor npm install
meteor build meteor-build --architecture os.linux.x86_64 --directory
copy aws-package.json meteor-build\bundle\package.json
cd meteor-build\bundle\programs\server
meteor npm install
meteor npm install fibers@3.1.1
