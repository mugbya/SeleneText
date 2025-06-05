
# 清理旧的构建文件
echo "清理旧的构建文件...."
rm -rf selene-client/dist
rm -rf selene-client/renderer
echo "✅ 清理旧的构建文件 ok"

# 编译前端代码
echo "编译前端代码...."
cd selene-ui-react
yarn build
echo "✅ 编译前端代码 成功"

# 构建 electron 应用
cd ..
cd selene-client
echo "构建 electron 应用...."
yarn build
echo "✅ 构建 electron 应用 成功"



