$(document).ready(function() {
  var kernelVersion = "4.0";
  var kernelNamespace = "http://datacite.org/schema/kernel-4";
  var kernelSchema = "http://schema.datacite.org/meta/kernel-4/metadata.xsd";
  var kernelSchemaLocation = kernelNamespace + " " + kernelSchema;
  var header = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + br() + "<resource xmlns=\"" + kernelNamespace + "\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"" + kernelSchemaLocation + "\">" + br();
  $("select[title]").each(function(){
	 var tagName = name($(this));
	 ps($(this),optionValues[tagName]);
  });
  $("body").on("keyup", "input", function(event) {
    event.preventDefault();
    var xml = header;
    $("div.section").each(function(){
    	xml += process($(this));
    })
    xml += ct("resource");
    metadata = xml;
    $("div.right code").text(xml);
    $(".right").show();
  });
  $("body").on("change", "select", function(event) {
    event.preventDefault();
    $("input").eq(0).keyup();
  });
  $("#reset").bind("click", function(event) {
    event.preventDefault();
    location.reload(true);
  });
  $("#selectall").bind("click", function(event) {
    event.preventDefault();
    st($("div code").get(0));
  });  
  $("button.add.group").bind("click", function(event) {
    event.preventDefault();
    var d = $(this).parent().find(".tag-group:first").clone();
    $(d).find("input,select").val("");
    $(d).find("input + button.delete.element").each(function() {
      $(this).prev("input").remove();
      $(this).remove();
    });
    $("<button/>", {"class":"delete group", type:"button", text:"-"}).appendTo($(d).find(".tag:first"));
    d.appendTo($(this).parent());
  });
  
  $("div.section").on("mouseenter mouseleave focusin focusout", "button.delete.group, button.delete.single-tag", function(event){
	 event.preventDefault();
	 $(this).parent().toggleClass("remove-highlight");
  });
  $("div.section").on("click", "button.delete.group", function(event) {
    event.preventDefault();
    $(this).parent().remove();
    $("input").eq(0).keyup();
  });
  $("body").on("click", " button.add.single-tag", function(event) {
    event.preventDefault();
    var c = $(this).parent().clone();
    $(c).find("input,select").val("");
    $(this).before($("<button/>", {"class":"delete single-tag", type:"button", text:"-"}));
    c.insertAfter($(this).parent());
    $(this).remove();
  });
  $("body").on("click", "button.delete.single-tag", function(event) {
    event.preventDefault();
    $(this).parent().remove();
    $("input").eq(0).keyup();
  });
  $("body").on("click", "button#more", function(event) {
    event.preventDefault();
    var div = $(this).parent();
    $(div).find("button#more").hide();
    $(div).find("div#subgroup,button#less").show();
  });
  $("body").on("click", "button#less", function(event) {
    event.preventDefault();
    var div = $(this).parent();
    $(div).find("div#subgroup,button#less").hide();
    $(div).find("button#more").show();
    $(div).find("div#subgroup input,div#subgroup select").val("");
    $("input").eq(0).keyup();
  });
  $("body").on("click", "h3.recommended,h3.other", function(event) {
    var div = $(this).next("div");
    var text = $(this).html();
    if (text.charAt(0) == "+") {
      text = text.replace("+", "-");
      $(this).html(text);
      $(div).show();
    } else {
      if (text.charAt(0) == "-") {
        text = text.replace("-", "+");
        $(this).html(text);
        $(div).hide();
      }
    }
  });
});

var optionValues = {};
optionValues["descriptionType"] = ["Abstract", "Methods", "SeriesInformation", "TableOfContents", "TechnicalInfo", "Other"];
optionValues["relatedIdentifierType"] = ["ARK", "arXiv", "bibcode", "DOI", "EAN13", "EISSN", "Handle", "IGSN", "ISBN", "ISSN", "ISTC", "LISSN", "LSID", "PMID", "PURL", "UPC", "URL", "URN"];
optionValues["relationType"] = ["IsCitedBy", "Cites", "IsSupplementTo", "IsSupplementedBy", "IsContinuedBy", "Continues", "HasMetadata", "IsMetadataFor","IsNewVersionOf", "IsPreviousVersionOf", "IsPartOf", "HasPart", "IsReferencedBy", "References", "IsDocumentedBy", "Documents", "IsCompiledBy", "Compiles", "IsVariantFormOf", "IsOriginalFormOf", "IsIdenticalTo", "IsReviewedBy", "Reviews", "IsDerivedFrom", "IsSourceOf"];
optionValues["resourceTypeGeneral"] = ["Audiovisual", "Collection", "Dataset", "Event", "Image", "InteractiveResource", "Model", "PhysicalObject", "Service", "Software", "Sound", "Text", "Workflow", "Other"];
optionValues["dateType"] = ["Accepted", "Available", "Copyrighted", "Collected", "Created", "Issued", "Submitted", "Updated", "Valid"];
optionValues["contributorType"] = ["ContactPerson", "DataCollector", "DataCurator", "DataManager", "Distributor", "Editor", "HostingInstitution", "Producer", "ProjectLeader", "ProjectManager", "ProjectMember", "RegistrationAgency", "RegistrationAuthority", "RelatedPerson", "Researcher", "ResearchGroup", "RightsHolder", "Sponsor", "Supervisor", "WorkPackageLeader", "Other"];
optionValues["titleType"] = ["AlternativeTitle", "Subtitle", "TranslatedTitle", "Other"];
optionValues["funderIdentifierType"] = ["Crossref Funder ID", "GRID", "ISNI", "Other"];

function process(section){
	var isWrapper = $(section).hasClass("wrapper-tag");
	var indent = 0;
	var xml = "";
		
	if (isWrapper){
		indent = 1;
	}
	
	$(section).find(".tag-group>.tag").each(function(){
		xml += processTag(this,indent);
	})
	
	if (xml.length > 0){
		if (isWrapper){
			var wrapperName = name(section);
			xml = ot(wrapperName) + br() + xml + ct(wrapperName) + br();
		}
	}	
	
	return xml;
}

function processTag(tag, indent){
	var xml = "";
	var attributes;
	var value;
	var tagName = name(tag);
	var attr = attribs(tag);
	
	var tagValues = $(tag).children(".tag-value");
	
	if ($(tagValues).length){
		value = inputValue(tagValues[0]);
	}

	$(tag).children(".tag").each(function(){
		xml += processTag(this,indent + 1);
	});
	
	if (xml.length > 0){
		xml = tab(indent) + ota(tagName,attr) + br() + xml + tab(indent) + ct(tagName) + br();
	}
	else if(typeof value !== "undefined" && (value.length > 0 || ($(tag).hasClass("allow-empty") && attr.length > 0))){
		xml = tab(indent) + ota(tagName,attr) + value + ct(tagName) + br();
	}
	
	return xml;
}

function attribs(element){
	var attribs = "";
	
	$(element).children(".tag-attribute").each(function(){
		var value = "";
		var n = name(this);
		
		if ( $(this).is("input") ){
			value = inputValue(this);
		}
		
		if ( $(this).is("select") ){
			value = selectValue(this);
		}
		
		if (value.length > 0){
			if (attribs.length > 0){
				attribs += " ";
			}
			attribs += n + "=\"" + value +"\"";
		}
	});
	
	return attribs;
}

function inputValue(input){
	return $(input).val().encodeXML();
}

function selectValue(select){
	return $(select).find("option").filter(":selected").val().encodeXML();
}

function name(tag){
	return $(tag).attr("title");
}

function ps(s, sarr) {
  var i = $(s).attr("title");
  addO(s, "", "[" + i + "]");
  for (var i = 0;i < sarr.length;i++) {
    addO(s, sarr[i], sarr[i]);
  }
}

function addO(s, v, d) {
  $(s).append($("<option>").val(v).html(d));
}

function br() {
  return "\n";
}

function tab(number){
	var tabs = "";
	if (typeof number !== "undefined"){
		for (var i = 1; i <= number; i++ ){
			tabs += "\t";
		}
	}
	else{
		tabs = "\t";
	}
	return tabs;
}

function ota(tag,attr) {
	if (attr.length > 0){
		return "<" + tag +" "+ attr + ">";
	}
	else{
		return ot(tag);
	}
}

function ot(tag) {
  return "<" + tag + ">";
}

function ct(tag) {
  return "</" + tag + ">";
}

function st(element) {
  var doc = document, text = element, range, selection;
  if (doc.body.createTextRange) {
    range = doc.body.createTextRange();
    range.moveToElementText(text);
    range.select();
  } else {
    if (window.getSelection) {
      selection = window.getSelection();
      range = doc.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}

String.prototype.encodeXML = function() {
  return this.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
};

var metadata = "";
var MIME_TYPE = "application/xml";
var cleanUp = function(a) {
  setTimeout(function() {
    window.URL.revokeObjectURL(a.href);
  }, 1500);
  $("span#output").html("");
};

var downloadFile = function() {
  window.URL = window.webkitURL || window.URL;
  var prevLink = $("span#output a");
  if (prevLink) {
    $("span#output").html("");
  }
  var bb = new Blob([metadata], {type:MIME_TYPE});
  var a = document.createElement("a");
  a.download = "metadata.xml";
  a.href = window.URL.createObjectURL(bb);
  a.textContent = "Click here to Save: metadata.xml";
  a.setAttribute("data-downloadurl", [MIME_TYPE, a.download, a.href].join(":"));
  a.classList.add("button");
  a.onclick = function(e) {
    if ($(this).is(":disabled")) {
      return false;
    }
    cleanUp(this);
  };
  $(a).appendTo($("span#output"));
};

function save() {
  if (false) {
    alert("Not currently supported in Internet Explorer");
  } else {
    downloadFile();
  }
}
;