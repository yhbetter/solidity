package com;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import org.web3j.abi.EventEncoder;
import org.web3j.abi.FunctionEncoder;
import org.web3j.abi.TypeReference;
import org.web3j.abi.datatypes.Address;
import org.web3j.abi.datatypes.Bool;
import org.web3j.abi.datatypes.Event;
import org.web3j.abi.datatypes.Function;
import org.web3j.abi.datatypes.Type;
import org.web3j.abi.datatypes.Utf8String;
import org.web3j.abi.datatypes.generated.Uint256;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.DefaultBlockParameter;
import org.web3j.protocol.core.RemoteCall;
import org.web3j.protocol.core.methods.request.EthFilter;
import org.web3j.protocol.core.methods.response.Log;
import org.web3j.protocol.core.methods.response.TransactionReceipt;
import org.web3j.tx.Contract;
import org.web3j.tx.TransactionManager;
import rx.Observable;
import rx.functions.Func1;

/**
 * <p>Auto generated code.
 * <p><strong>Do not modify!</strong>
 * <p>Please use the <a href="https://docs.web3j.io/command_line.html">web3j command line tools</a>,
 * or the org.web3j.codegen.SolidityFunctionWrapperGenerator in the 
 * <a href="https://github.com/web3j/web3j/tree/master/codegen">codegen module</a> to update.
 *
 * <p>Generated with web3j version 3.4.0.
 */
public class WellDistribution extends Contract {
    private static final String BINARY = "0x60606040526006805460ff19169055341561001957600080fd5b60405160c080610c9e83398101604052808051919060200180519190602001805191906020018051919060200180519190602001805160008054600160a060020a03338116600160a060020a031992831617909255600180549290931691161790555050600294909455600392909255600455600891909155600755610bfa806100a46000396000f3006060604052600436106101245763ffffffff60e060020a60003504166306bcf02f811461029e5780630b2f48a0146102b657806316ada547146102cc57806317ffc320146102f157806318160ddd1461031057806327e235e31461032357806329144bdb146103425780632c0e03f4146103585780632c8ca0ea146103875780633197cbb6146103ae578063469d544d146103c157806353cf61ab1461045b5780636ab3846b1461047157806373b6eacf1461048757806378e979251461049a5780638da5cb5b146104ad5780639a6a30a4146104c0578063a9ff5790146104df578063b482f0bb146104f2578063c0ee0b8a14610505578063cce0cd0c14610534578063e0b1cccb146105be578063ef454df2146105e0578063f2fde38b146105f3575b600154600090819081908190600160a060020a03166370a0823133836040516020015260405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b151561018557600080fd5b6102c65a03f1151561019657600080fd5b505050604051805190501115156101ac57600080fd5b600034116101b957600080fd5b6101c1610612565b9250600754831180156101d5575060085483105b15156101e057600080fd5b6003543410806101f1575060045434115b915081156101fe57600080fd5b60065460ff161561020e57600080fd5b506005805434908101918290556002549091111561022b57600080fd5b600160a060020a033316600081815260096020526040908190208054349081019091557fd90d253a9de34d2fdd5a75ae49ea17fcb43af32fc8ea08cc6d2341991dd3872e915190815260200160405180910390a26002546005541415610299576006805460ff191660011790555b505050005b34156102a957600080fd5b6102b4600435610616565b005b34156102c157600080fd5b6102b4600435610636565b34156102d757600080fd5b6102df610612565b60405190815260200160405180910390f35b34156102fc57600080fd5b6102b4600160a060020a0360043516610656565b341561031b57600080fd5b6102df61070a565b341561032e57600080fd5b6102df600160a060020a0360043516610710565b341561034d57600080fd5b6102b4600435610722565b341561036357600080fd5b61036b610742565b604051600160a060020a03909116815260200160405180910390f35b341561039257600080fd5b61039a610751565b604051901515815260200160405180910390f35b34156103b957600080fd5b6102df61075a565b34156103cc57600080fd5b61039a60046024813581810190830135806020818102016040519081016040528093929190818152602001838360200280828437820191505050505050919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284375094965050509235600160a060020a03169250610760915050565b341561046657600080fd5b6102b46004356108f6565b341561047c57600080fd5b6102b4600435610916565b341561049257600080fd5b6102df610940565b34156104a557600080fd5b6102df610946565b34156104b857600080fd5b61036b61094c565b34156104cb57600080fd5b6102b4600160a060020a036004351661095b565b34156104ea57600080fd5b6102df6109b3565b34156104fd57600080fd5b6102df6109b9565b341561051057600080fd5b6102b460048035600160a060020a03169060248035916044359182019101356109bf565b341561053f57600080fd5b6105476109c4565b60405160208082528190810183818151815260200191508051906020019080838360005b8381101561058357808201518382015260200161056b565b50505050905090810190601f1680156105b05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156105c957600080fd5b6102b4600160a060020a0360043516602435610a05565b34156105eb57600080fd5b6102b4610a3c565b34156105fe57600080fd5b6102b4600160a060020a0360043516610a66565b4290565b60005433600160a060020a0390811691161461063157600080fd5b600755565b60005433600160a060020a0390811691161461065157600080fd5b600255565b6000805433600160a060020a0390811691161461067257600080fd5b81600160a060020a03166370a082313060006040516020015260405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b15156106c957600080fd5b6102c65a03f115156106da57600080fd5b50505060405180516000549092506107069150600160a060020a0384811691168363ffffffff610b0116565b5050565b60055481565b60096020526000908152604090205481565b60005433600160a060020a0390811691161461073d57600080fd5b600455565b600154600160a060020a031681565b60065460ff1681565b60085481565b600080600080600080600089511161077757600080fd5b875189511461078557600080fd5b86600160a060020a03166370a082313060006040516020015260405160e060020a63ffffffff8416028152600160a060020a039091166004820152602401602060405180830381600087803b15156107dc57600080fd5b6102c65a03f115156107ed57600080fd5b50505060405180519550506000851161080957600095506108ea565b600093505b88518410156108e55788848151811061082357fe5b90602001906020020151600160a060020a0381166000908152600960205260408120549194509092508211610857576108da565b6108768289868151811061086757fe5b90602001906020020151610b86565b9050610892600160a060020a038816848363ffffffff610b0116565b86600160a060020a031683600160a060020a03167f5d4a5c2dc42c42a54fc118b4df3d85fff7cdc47e34c0bddfcd658a4d2c27ae8d8360405190815260200160405180910390a35b60019093019261080e565b600195505b50505050509392505050565b60005433600160a060020a0390811691161461091157600080fd5b600355565b60005433600160a060020a0390811691161461093157600080fd5b6008556006805460ff19169055565b60025481565b60075481565b600054600160a060020a031681565b60005433600160a060020a0390811691161461097657600080fd5b80600160a060020a03166108fc30600160a060020a0316319081150290604051600060405180830381858888f1935050505015156109b057fe5b50565b60045481565b60035481565b600080fd5b6109cc610bbc565b60408051908101604052600a81527f7344697374722e302e31000000000000000000000000000000000000000000006020820152919050565b60005433600160a060020a03908116911614610a2057600080fd5b600160a060020a03909116600090815260096020526040902055565b60005433600160a060020a03908116911614610a5757600080fd5b6006805460ff19166001179055565b60005433600160a060020a03908116911614610a8157600080fd5b600160a060020a0381161515610a9657600080fd5b600054600160a060020a0380831691167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a36000805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a0392909216919091179055565b82600160a060020a031663a9059cbb838360006040516020015260405160e060020a63ffffffff8516028152600160a060020a0390921660048301526024820152604401602060405180830381600087803b1515610b5e57600080fd5b6102c65a03f11515610b6f57600080fd5b505050604051805190501515610b8157fe5b505050565b600080831515610b995760009150610bb5565b50828202828482811515610ba957fe5b0414610bb157fe5b8091505b5092915050565b602060405190810160405260008152905600a165627a7a72305820c3e1a93787b215169683941214e85d6abf9e0103133f100492b16e21805dd9a50029\n";

    public static final String FUNC_UPDATESTARTTIME = "updateStartTime";

    public static final String FUNC_UPDATEAMOUNTLIMIT = "updateAmountLimit";

    public static final String FUNC_TIME = "time";

    public static final String FUNC_RECLAIMTOKEN = "reclaimToken";

    public static final String FUNC_TOTALSUPPLY = "totalSupply";

    public static final String FUNC_BALANCES = "balances";

    public static final String FUNC_UPDATEMAXLIMIT = "updateMaxLimit";

    public static final String FUNC_REGISTTOKEN = "registToken";

    public static final String FUNC_ISFINISH = "isFinish";

    public static final String FUNC_ENDTIME = "endTime";

    public static final String FUNC_DISTRIBUTION = "distribution";

    public static final String FUNC_UPDATEMINLIMIT = "updateMinLimit";

    public static final String FUNC_UPDATEENDTIME = "updateEndTime";

    public static final String FUNC_AMOUNTLIMIT = "amountLimit";

    public static final String FUNC_STARTTIME = "startTime";

    public static final String FUNC_OWNER = "owner";

    public static final String FUNC_RECLAIMETHER = "reclaimEther";

    public static final String FUNC_AMOUNTMAXLIMIT = "amountMaxLimit";

    public static final String FUNC_AMOUNTMINLIMIT = "amountMinLimit";

    public static final String FUNC_TOKENFALLBACK = "tokenFallback";

    public static final String FUNC_BLOCKVERSION = "blockVersion";

    public static final String FUNC_UPDATEBALANCE = "updateBalance";

    public static final String FUNC_UPDATEFINISH = "updateFinish";

    public static final String FUNC_TRANSFEROWNERSHIP = "transferOwnership";

    public static final Event DISTR_EVENT = new Event("Distr", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}),
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    public static final Event INVEST_EVENT = new Event("Invest", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}),
            Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
    ;

    public static final Event OWNERSHIPTRANSFERRED_EVENT = new Event("OwnershipTransferred", 
            Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}, new TypeReference<Address>() {}),
            Arrays.<TypeReference<?>>asList());
    ;

    protected WellDistribution(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    protected WellDistribution(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        super(BINARY, contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public RemoteCall<TransactionReceipt> updateStartTime(BigInteger _startTime) {
        final Function function = new Function(
                FUNC_UPDATESTARTTIME, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_startTime)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> updateAmountLimit(BigInteger _amount) {
        final Function function = new Function(
                FUNC_UPDATEAMOUNTLIMIT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_amount)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> time() {
        final Function function = new Function(FUNC_TIME, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<TransactionReceipt> reclaimToken(String token) {
        final Function function = new Function(
                FUNC_RECLAIMTOKEN, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(token)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> totalSupply() {
        final Function function = new Function(FUNC_TOTALSUPPLY, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<BigInteger> balances(String param0) {
        final Function function = new Function(FUNC_BALANCES, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(param0)), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<TransactionReceipt> updateMaxLimit(BigInteger _max) {
        final Function function = new Function(
                FUNC_UPDATEMAXLIMIT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_max)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<String> registToken() {
        final Function function = new Function(FUNC_REGISTTOKEN, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<Boolean> isFinish() {
        final Function function = new Function(FUNC_ISFINISH, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Bool>() {}));
        return executeRemoteCallSingleValueReturn(function, Boolean.class);
    }

    public RemoteCall<BigInteger> endTime() {
        final Function function = new Function(FUNC_ENDTIME, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<TransactionReceipt> distribution(List<String> _as, List<BigInteger> _bs, String token) {
        final Function function = new Function(
                FUNC_DISTRIBUTION, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.DynamicArray<org.web3j.abi.datatypes.Address>(
                        org.web3j.abi.Utils.typeMap(_as, org.web3j.abi.datatypes.Address.class)), 
                new org.web3j.abi.datatypes.DynamicArray<org.web3j.abi.datatypes.generated.Uint256>(
                        org.web3j.abi.Utils.typeMap(_bs, org.web3j.abi.datatypes.generated.Uint256.class)), 
                new org.web3j.abi.datatypes.Address(token)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> updateMinLimit(BigInteger _min) {
        final Function function = new Function(
                FUNC_UPDATEMINLIMIT, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_min)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> updateEndTime(BigInteger _endTime) {
        final Function function = new Function(
                FUNC_UPDATEENDTIME, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_endTime)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> amountLimit() {
        final Function function = new Function(FUNC_AMOUNTLIMIT, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<BigInteger> startTime() {
        final Function function = new Function(FUNC_STARTTIME, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<String> owner() {
        final Function function = new Function(FUNC_OWNER, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Address>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<TransactionReceipt> reclaimEther(String oo) {
        final Function function = new Function(
                FUNC_RECLAIMETHER, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(oo)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<BigInteger> amountMaxLimit() {
        final Function function = new Function(FUNC_AMOUNTMAXLIMIT, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<BigInteger> amountMinLimit() {
        final Function function = new Function(FUNC_AMOUNTMINLIMIT, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Uint256>() {}));
        return executeRemoteCallSingleValueReturn(function, BigInteger.class);
    }

    public RemoteCall<TransactionReceipt> tokenFallback(String from_, BigInteger value_, byte[] data_) {
        final Function function = new Function(
                FUNC_TOKENFALLBACK, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(from_), 
                new org.web3j.abi.datatypes.generated.Uint256(value_), 
                new org.web3j.abi.datatypes.DynamicBytes(data_)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<String> blockVersion() {
        final Function function = new Function(FUNC_BLOCKVERSION, 
                Arrays.<Type>asList(), 
                Arrays.<TypeReference<?>>asList(new TypeReference<Utf8String>() {}));
        return executeRemoteCallSingleValueReturn(function, String.class);
    }

    public RemoteCall<TransactionReceipt> updateBalance(String _ow, BigInteger _bal) {
        final Function function = new Function(
                FUNC_UPDATEBALANCE, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(_ow), 
                new org.web3j.abi.datatypes.generated.Uint256(_bal)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> updateFinish() {
        final Function function = new Function(
                FUNC_UPDATEFINISH, 
                Arrays.<Type>asList(), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public RemoteCall<TransactionReceipt> transferOwnership(String newOwner) {
        final Function function = new Function(
                FUNC_TRANSFEROWNERSHIP, 
                Arrays.<Type>asList(new org.web3j.abi.datatypes.Address(newOwner)), 
                Collections.<TypeReference<?>>emptyList());
        return executeRemoteCallTransaction(function);
    }

    public static RemoteCall<WellDistribution> deploy(Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit, BigInteger _amountLimit, BigInteger _amountMinLimit, BigInteger _amountMaxLimit, BigInteger _startTime, BigInteger _endTime, String token_) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_amountLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_amountMinLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_amountMaxLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_startTime), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.Address(token_)));
        return deployRemoteCall(WellDistribution.class, web3j, credentials, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    public static RemoteCall<WellDistribution> deploy(Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit, BigInteger _amountLimit, BigInteger _amountMinLimit, BigInteger _amountMaxLimit, BigInteger _startTime, BigInteger _endTime, String token_) {
        String encodedConstructor = FunctionEncoder.encodeConstructor(Arrays.<Type>asList(new org.web3j.abi.datatypes.generated.Uint256(_amountLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_amountMinLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_amountMaxLimit), 
                new org.web3j.abi.datatypes.generated.Uint256(_startTime), 
                new org.web3j.abi.datatypes.generated.Uint256(_endTime), 
                new org.web3j.abi.datatypes.Address(token_)));
        return deployRemoteCall(WellDistribution.class, web3j, transactionManager, gasPrice, gasLimit, BINARY, encodedConstructor);
    }

    public List<DistrEventResponse> getDistrEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(DISTR_EVENT, transactionReceipt);
        ArrayList<DistrEventResponse> responses = new ArrayList<DistrEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            DistrEventResponse typedResponse = new DistrEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._to = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse._token = (String) eventValues.getIndexedValues().get(1).getValue();
            typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<DistrEventResponse> distrEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, DistrEventResponse>() {
            @Override
            public DistrEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(DISTR_EVENT, log);
                DistrEventResponse typedResponse = new DistrEventResponse();
                typedResponse.log = log;
                typedResponse._to = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse._token = (String) eventValues.getIndexedValues().get(1).getValue();
                typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<DistrEventResponse> distrEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(DISTR_EVENT));
        return distrEventObservable(filter);
    }

    public List<InvestEventResponse> getInvestEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(INVEST_EVENT, transactionReceipt);
        ArrayList<InvestEventResponse> responses = new ArrayList<InvestEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            InvestEventResponse typedResponse = new InvestEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse._to = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<InvestEventResponse> investEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, InvestEventResponse>() {
            @Override
            public InvestEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(INVEST_EVENT, log);
                InvestEventResponse typedResponse = new InvestEventResponse();
                typedResponse.log = log;
                typedResponse._to = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse._value = (BigInteger) eventValues.getNonIndexedValues().get(0).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<InvestEventResponse> investEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(INVEST_EVENT));
        return investEventObservable(filter);
    }

    public List<OwnershipTransferredEventResponse> getOwnershipTransferredEvents(TransactionReceipt transactionReceipt) {
        List<Contract.EventValuesWithLog> valueList = extractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, transactionReceipt);
        ArrayList<OwnershipTransferredEventResponse> responses = new ArrayList<OwnershipTransferredEventResponse>(valueList.size());
        for (Contract.EventValuesWithLog eventValues : valueList) {
            OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
            typedResponse.log = eventValues.getLog();
            typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
            typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
            responses.add(typedResponse);
        }
        return responses;
    }

    public Observable<OwnershipTransferredEventResponse> ownershipTransferredEventObservable(EthFilter filter) {
        return web3j.ethLogObservable(filter).map(new Func1<Log, OwnershipTransferredEventResponse>() {
            @Override
            public OwnershipTransferredEventResponse call(Log log) {
                Contract.EventValuesWithLog eventValues = extractEventParametersWithLog(OWNERSHIPTRANSFERRED_EVENT, log);
                OwnershipTransferredEventResponse typedResponse = new OwnershipTransferredEventResponse();
                typedResponse.log = log;
                typedResponse.previousOwner = (String) eventValues.getIndexedValues().get(0).getValue();
                typedResponse.newOwner = (String) eventValues.getIndexedValues().get(1).getValue();
                return typedResponse;
            }
        });
    }

    public Observable<OwnershipTransferredEventResponse> ownershipTransferredEventObservable(DefaultBlockParameter startBlock, DefaultBlockParameter endBlock) {
        EthFilter filter = new EthFilter(startBlock, endBlock, getContractAddress());
        filter.addSingleTopic(EventEncoder.encode(OWNERSHIPTRANSFERRED_EVENT));
        return ownershipTransferredEventObservable(filter);
    }

    public static WellDistribution load(String contractAddress, Web3j web3j, Credentials credentials, BigInteger gasPrice, BigInteger gasLimit) {
        return new WellDistribution(contractAddress, web3j, credentials, gasPrice, gasLimit);
    }

    public static WellDistribution load(String contractAddress, Web3j web3j, TransactionManager transactionManager, BigInteger gasPrice, BigInteger gasLimit) {
        return new WellDistribution(contractAddress, web3j, transactionManager, gasPrice, gasLimit);
    }

    public static class DistrEventResponse {
        public Log log;

        public String _to;

        public String _token;

        public BigInteger _value;
    }

    public static class InvestEventResponse {
        public Log log;

        public String _to;

        public BigInteger _value;
    }

    public static class OwnershipTransferredEventResponse {
        public Log log;

        public String previousOwner;

        public String newOwner;
    }
}
