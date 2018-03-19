include(["Engines", "Wine", "Engine", "Object"]);
include(["Utils", "Functions", "Net", "Resource"]);
include(["Utils", "Functions", "Filesystem", "Files"]);

/**
* All the necessary things to run winevulkan (even inside wine mainline or newest wine-staging)
* -> https://github.com/roderickc/wine-vulkan
* @returns {Wine}
*/
Wine.prototype.vulkanSDK = function() {
	print("NOTE: you need a driver that support Vulkan enough to run winevulkan");
	
	var setupFile = new Resource()
		.wizard(this._wizard)
                .url("https://sdk.lunarg.com/sdk/download/1.0.68.0/windows/VulkanSDK-1.0.68.0-Installer.exe")
                .checksum("fe85c637c3d55c2972a997fcec44212d55d41a98")
                .name("VulkanSDK-1.0.68.0-Installer.exe")
		.get();
		
	this.run(setupFile, "/S");
	
	var pathVulkanJSON = this.prefixDirectory + "drive_c/windows/winevulkan.json" 
	var contentVulkanJSON = '{\n'                                                                          +
                                '	"file_format_version": "1.0.0",\n'				       +
                                '	"ICD": {\n'							       +
                                '		"library_path": "c:\\windows\\system32\\winevulkan.dll",\n'    +
                                '		"api_version": "1.0.51"\n'				       +
                                '	}\n'								       +
                                '}'									

	writeToFile(pathVulkanJSON,contentVulkanJSON);
	
	var regeditFileContent = 
	"REGEDIT4\n"                                              	+
        "\n"                                                      	+
        "[HKEY_LOCAL_MACHINE\\SOFTWARE\\Khronos\\Vulkan\\Drivers\\]\n" 	+
        "\"C:\Windows\winevulkan.json\"=dword:00000000"
		
	this.regedit().patch(regeditFileContent);
	
	if (this.architecture() == "amd64") {
		var regeditFileContent = 
		"REGEDIT4\n"                                             	           +
                "\n"                                                            	   +
                "[HKEY_LOCAL_MACHINE\\SOFTWARE\\Wow6432Node\\Khronos\\Vulkan\\Drivers\\]n" +
		"\"C:\Windows\winevulkan.json\"=dword:00000000"
		
		this.regedit().patch(regeditFileContent);
	}
	
	return this;
	
}
