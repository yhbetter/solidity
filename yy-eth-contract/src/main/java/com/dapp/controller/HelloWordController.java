package com.dapp.controller;

import com.dapp.service.HelloWordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 版权所有：北京金骨朵文化传播有限公司
 *
 * @DATE 30/01/2018 22:20
 */
@Controller
public class HelloWordController {

    @Autowired
    private HelloWordService helloWordService;


    @GetMapping("/hello_word")
    @ResponseBody
    public String helloWord(){
        try {
            helloWordService.helloWord();
        } catch (Exception e) {
            e.printStackTrace();
            return "failure";
        }
        return "success";
    }


}
