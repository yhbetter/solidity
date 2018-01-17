# solidity

## 环境搭建

1. 安装NodeJs
2. 安装testrpc (测试环境)  go-ethereum (真实环境)
3. 安装 [solc](http://solidity.readthedocs.io/en/latest/installing-solidity.html).
4. 安装 [truffle](https://github.com/trufflesuite/truffle).

### 安装ethereum
##### Mac

	brew tap ethereum/ethereum
	brew install ethereum
	
### 安装Solc(Mac)
	
	npm install -g solc
	
	

### 安装truffle(Mac)
	
	npm install -g truffle

---


## example:pet-shop-tutorial

#### 环境搭建

- 安装Node
- 安装 Truffle ：npm install -g truffle
- 安装[Ganache](http://truffleframework.com/ganache/)
> Ganache（或Ganache CLI）已经取代了 testrpc。
- 安装 [MetaMask](https://metamask.io/)
- 安装后点击chrome的小狐狸,点击页面的 Import Existing DEN，输入Ganache显示的助记词。
> candy maple cake sugar pudding cream honey rich smooth crumble sweet treat
- 然后自己想要的密码，点击OK
- 点击左上角选择Custom RPC,添加网络:http://127.0.0.1:7545 OK

#### 项目运行
- truffle compile
- 启动Ganache
- truffle  migrate
- npm run dev