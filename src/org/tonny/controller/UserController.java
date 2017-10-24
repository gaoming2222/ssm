package org.tonny.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.apache.log4j.Logger;
import org.tonny.model.User;
import org.tonny.service.IUserService;

@Controller
public class UserController
{
    private static final Logger log = Logger.getLogger(UserController.class);
	@Autowired
	private IUserService userService;

    @RequestMapping(value = "/doLogin")
    //public String doLogin(HttpServletRequest request)
	public String doLogin(@RequestParam("username") String userName, @RequestParam("password") String pwd, Map<String,Object> map)
	{
        boolean authorized = userService.isAuthorizedUser(userName, pwd);
        if(authorized)
        {
        	List<User> userList = userService.getAll();
    		map.put("userList", userList);
            return "user/user_list";
        }
        else
        {
        	return "login";
        }
    }

	@RequestMapping(value = "/getall")
	public String getAll(Map<String,Object> map)
	{
		List<User> userList = userService.getAll();
		map.put("userList", userList);
		return "user/user_list";
	}

	@RequestMapping(value = "/query", method = RequestMethod.POST)
	public ModelAndView query(@RequestParam("username")String userName)
	{
		User user = new User();
		user.setName(userName);
		List<User> userList = userService.getUserListByCondition(user);
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.addObject("userList", userList);
		modelAndView.setViewName("user/user_list");
		return modelAndView;
	}

	@RequestMapping(value = "/toadd")
    public String toAdd()
    {
        return "user/user_add";
    }

	@RequestMapping(value = "/add", method = RequestMethod.POST)
    public String add(User user)
    {
		log.info(user);
	    userService.add(user);
        return "redirect:/getall";
    }

	@RequestMapping("/edit/{id}")
	public String edit(@PathVariable(value="id") Integer id, Map<String,Object> map)
	{
		User user = userService.getUserById(id);
		map.put("user", user);
		return "user/user_edit";
	}

	@RequestMapping(value = "/update", method = RequestMethod.POST)
    public String update(User user)
    {
        userService.update(user);
        return "redirect:/getall";
    }

	@RequestMapping(value = "/delete/{id}")
    public String delete(@PathVariable(value="id") Integer id)
    {
        userService.deleteById(id);
        return "redirect:/getall";
    }

	@RequestMapping("/toUploadPage")
	public String toUploadPage()
	{
		return "upload";
	}


	@RequestMapping("/")
	public String getIndex()
	{
		return "index";
	}

	/**
	 * desc:涓婁紶鏂囦欢
	 * @param multifiles
	 * @param request
	 * @return
	 * @throws Exception
	 * date:2017骞�1鏈�24鏃�
	 * author:Tonny Chien
	 */
	@RequestMapping("/upload")
	public String upload(@RequestParam MultipartFile[] multifiles, HttpServletRequest request) throws Exception
	{
		for (MultipartFile file : multifiles)
		{
			// 姝ゅMultipartFile[]琛ㄦ槑鏄鏂囦欢,濡傛灉鏄崟鏂囦欢MultipartFile灏辫浜�
			if (file.isEmpty())
			{
				log.info("鏂囦欢鏈笂浼�!");
			}
			else
			{
				// 寰楀埌涓婁紶鐨勬枃浠跺悕
				String fileName = file.getOriginalFilename();
				// 寰楀埌鏈嶅姟鍣ㄩ」鐩彂甯冭繍琛屾墍鍦ㄥ湴鍧�
				String imgPath = "F:" + File.separator;
				// 姝ゅ鏈娇鐢║UID鏉ョ敓鎴愬敮涓�鏍囪瘑,鐢ㄦ棩鏈熷仛涓烘爣璇�
				String path = imgPath + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + fileName;
				//String path = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date()) + fileName;
				// 鏌ョ湅鏂囦欢涓婁紶璺緞,鏂逛究鏌ユ壘
				log.info(path);
				// 鎶婃枃浠朵笂浼犺嚦path鐨勮矾寰�
				File localFile = new File(path);
				file.transferTo(localFile);
			}
		}
		return "success";
	}

	/**
	 * desc:涓嬭浇鏂囦欢
	 * @param fileName
	 * @param request
	 * @param response
	 * @return
	 * date:2017骞�1鏈�24鏃�
	 * author:Tonny Chien
	 */
	@RequestMapping("/download")
	public String download(String fileName, HttpServletRequest request, HttpServletResponse response)
	{
		response.setCharacterEncoding("utf-8");
		response.setContentType("multipart/form-data");
		response.setHeader("Content-Disposition", "attachment;fileName=" + fileName);
		try
		{
			//String path = request.getSession().getServletContext().getRealPath("image") + File.separator;
			String path = "F:"+ File.separator;
			InputStream inputStream = new FileInputStream(new File(path + fileName));

			OutputStream os = response.getOutputStream();
			byte[] b = new byte[2048];
			int length;
			while ((length = inputStream.read(b)) > 0)
			{
				os.write(b, 0, length);
			}

			os.flush();
			// 杩欓噷涓昏鍏抽棴銆�
			os.close();

			inputStream.close();
		}
		catch (Exception e)
		{
			log.error(e);
		}
		// 杩斿洖鍊艰娉ㄦ剰锛岃涓嶇劧灏卞嚭鐜颁笅闈㈣繖鍙ラ敊璇紒
		// java+getOutputStream() has already been called for this response
		return null;
	}

	/**
	 * desc:json璇锋眰鎿嶄綔绀轰緥锛� method鐨勬柟寮忛渶瑕佷笌json鐨勮姹傛柟寮忓搴旇捣鏉�
	 * @param id
	 * @param type
	 * @return
	 * date:2017骞�2鏈�3鏃�
	 * author:Tonny Chien
	 */
	@RequestMapping(value = "/jsonOper", method = RequestMethod.POST)
	public @ResponseBody String jsonSource(@RequestParam("id")Integer id, @RequestParam("type")String type)
	{
		System.out.println("id: " + id + "type: " + type);
		return "OK";

	}
}
