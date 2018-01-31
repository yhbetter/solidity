package com.dapp.service;

import com.dapp.contract.HelloWord;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.Contract;
import org.web3j.tx.ManagedTransaction;

@Service
@Slf4j
public class HelloWordService {

    @Value("${eth.rpc.host}")
    private String rpcHost;

    @Value("${eth.private.key}")
    private String privateKey;

    @Value("${hello.word.contract.address}")
    private String contractAddress;

    public void helloWord() throws Exception {

        Web3j web3 = Web3j.build(new HttpService(rpcHost));

        Credentials credentials = Credentials.create(privateKey);

        HelloWord hw = HelloWord.load(contractAddress, web3, credentials, ManagedTransaction.GAS_PRICE, Contract.GAS_LIMIT);

        String greet = hw.greet().send();

        log.info("greet:" + greet);

        hw.setGreeting("new hello word!").send();

        log.info("new greet:" + hw.greet().send());

    }

}
