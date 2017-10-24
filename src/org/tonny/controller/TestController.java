package org.tonny.controller;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class TestController {
	 private static final Logger log = Logger.getLogger(UserController.class);

	 @RequestMapping("/user")
		public String getIndex()
		{
			return "quotainfomng";
		}
	 @RequestMapping("/table")
		public String getTest()
		{
			return "demo1";
		}
}
