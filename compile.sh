cd apps/meteor
meteor build --server-only --directory /tmp/rc-build
cp .docker/Dockerfile.alpine /tmp/rc-build/Dockerfile
cd /tmp/rc-build
docker build . -t cestic.chat:latest
docker tag cestic.chat:latest intman/cestic.chat:latest
docker push intman/cestic.chat:latest
