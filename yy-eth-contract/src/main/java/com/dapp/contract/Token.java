package com.dapp.contract;

import org.apache.commons.lang3.ObjectUtils;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.abi.datatypes.generated.Uint8;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.tx.Contract;
import org.web3j.tx.ManagedTransaction;

import java.io.IOException;
import java.util.Arrays;

/**
 * ClassName:Token <br/>
 * Date:     2018-02-08 17:37 <br/>
 *
 * @author yanghang
 * @see
 */
public class Token extends Contract {


    public Token(String contractAddress, Web3j web3j, Credentials credentials) {
        super("", contractAddress, web3j, credentials,  ManagedTransaction.GAS_PRICE,  Contract.GAS_LIMIT);
    }



    public Utf8String name() throws IOException {
        Function function = new Function("name",
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
         return executeCallSingleValueReturn(function);
    }


    public Uint256 totalSupply() throws IOException {
        Function function = new Function("totalSupply",
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeCallSingleValueReturn(function);
    }

    public Uint8 decimals() throws IOException {
        Function function = new Function("decimals",
                Arrays.<Type>asList(),
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint8>() {}));
        return executeCallSingleValueReturn(function);
    }


}
