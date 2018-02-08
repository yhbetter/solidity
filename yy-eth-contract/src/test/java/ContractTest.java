/**
 * ClassName:ContractTest <br/>
 * Date:     2018-02-08 18:36 <br/>
 *
 * @author yanghang
 * @see
 */

import com.dapp.DappApplication;
import com.dapp.contract.Token;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;

import java.io.IOException;

@RunWith(SpringJUnit4ClassRunner.class) // SpringJUnit支持，由此引入Spring-Test框架支持！
@SpringApplicationConfiguration(classes = DappApplication.class) // 指定我们SpringBoot工程的Application启动类
@WebAppConfiguration // 由于是Web项目，Junit需要模拟ServletContext，因此我们需要给我们的测试类加上@WebAppConfiguration。
public class ContractTest {

    @Value("${eth.rpc.host}")
    private String rpcHost;

    @Value("${eth.private.key}")
    private String privateKey;

    @Value("${hello.word.contract.address}")
    private String contractAddress;


    @Test
    public void test() throws IOException {


        Web3j web3 = Web3j.build(new HttpService("https://mainnet.infura.io/bRDKvvDHuY1ZQtHgEbZO"));

        Credentials credentials = Credentials.create(privateKey);
        Token btm = new Token("0xcb97e65f07da24d46bcdd078ebebd7c6e6e3d750",web3,credentials);
        btm.name();
    }
}
