// init parse app
Parse.initialize("Y6XyT34v5Qj6PrN9XIZa3zkKAxtkHD9Itf7RSDiv", "EJALjawWfRgVmkxEZhfrU75YjMvYLWhna7enZ78P");

var Comment = Parse.Object.extend("Comment");
$("#stars").raty();

$("#form").submit(function() {
	var commentItem = new Comment();
	var commentTitle = $("#review-title");
	var commentBody = $("review-body");

	// alert if no stars given
	if ($("#stars").raty("score") == null){
		alert("giff star rating plz");

		return false;
	}

	// alert if no given title
	if (commentTitle.val() == "") {
		alert("y u no write title?!");

		return false;
	}

	// storing input vals
	commentItem.set("title", commentTitle.val());
	commentItem.set("body", commentBody.val());
	commentItem.set("stars", parseInt($("#stars").raty("score")));
	commentItem.set("totalVotes", 0);
	commentItem.set("votes", 0);

	commentItem.save(null, {
		success: function() { // set all inputs to blank

			commentTitle.val("");
			commentBody.val("");
			$("#stars").raty({score: 0});

			getData();
		}
	});	

	return false;
});

var getData = function() {
	var query = new Parse.Query(Comment);
	
	query.notEqualTo("title");

	query.find({
		success:function(results) {
			buildList(results);
		}
	})
	
}

var buildList = function(data) {	
	$("ol").empty();
	var stars = 0;

	data.forEach(function(item) {
		stars += item.get("stars");
		insert(item);
		console.log(stars);
	});

	var productRating = $("#product-rating");
	productRating.raty({score: stars / (data.length),readOnly:true});
}

var insert = function(item) {
	var commentSection = $("div id='reviews'></div")
	var title = item.get("title");
	var body = item.get("body");

	var starHTML = $("<div id='rated-stars'></div>");
	var titleHTML = $("<h1></h1>");

	var bodyHTML = $("<text></text>");
	var votesHTML = $("<text></text>");

	var title = item.get("commentTitle");
	var body = item.get("commentBody");

	var totalVotes = item.get("totalVotes");
	var votes = item.get("votes");

	var stars = item.get("stars");

	var li = $("<li></li>");
	var upvote = $("<button>&uarr;</button>"); //up arrow symbol
	var downvote = $("<button>&darr;</button>"); //down arrow symbol


	upvote.on("click", function() {
		item.set("totalVotes", totalVotes++); 
		item.set("votes", votes++);
		
		item.save();
		getData();
	});

	downvote.on("click", function() {
		//dont increment "votes" (positive)
		item.set("totalVotes", totalVotes++);
		
		item.save();
		getData();
	});

	//insert html
	titleHTML.text(title);
	bodyHTML.text(body);
	//ESCAPE
	votesHTML.text(votes + "\/" + totalVotes + " liked this comment!");

	titleHTML.append(upvote);
	titleHTML.append(downvote);

	commentSection.append(bodyHTML);
	commentSection.append(starHTML);
	commentSection.append(votesHTML);

	li.append(commentSection);

	$("ol").append(li);

	starHTML.raty({score: stars, readOnly:true});	
	
}



getData();

