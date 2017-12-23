// new Vue({
//     el: '#question',
//     data: {
//         title: 'hello',
//         time: 60
//     },
//     method: {
//         timeLeft: function(){
//             var that = this;
//             setInterval(function(){
//                 if (that.time > 0) {
//                     return that.time--;
//                 } else clearInterval();
//             },1000);
//         }
//     },
//     mounted: function () {
//         var that = this;
//         setInterval(
// function(){
//             if (that.time > 0) {
//                 return that.time--;
//             } else clearInterval();
//         },1000);
//     }
//
// });

var questions = [];
var result = 0;
var numberOfQuestions;

$(document).ready(function () {
    $.get({
        url: 'data/questions.json',
        success: function (result) {
            // var obb = JSON.parse(result);
            questions = result.questions;
            questions.forEach(function(item){
                item.shown = false;
            });
            numberOfQuestions = questions.length;
            showQuestion(chooseRandomQuestion(questions));
        }
    });

});
$('#next').click(function(e) {
    var userAnswer = $("input[name = 'answer']:checked");
    if (userAnswer.length > 0 ) {
        stopTimer();
        var questionId = $(e.target).attr('data-question-id');
        var currentQuestion = questions[questionId];
        switch (currentQuestion.type) {
            case 'radio' : {
                var userAnswer = $("input[name = 'answer']:checked")[0];
                if (userAnswer.value == currentQuestion.correctAnswerIndex) {
                    result++;
                }
                break;
            }
            case 'checkbox': {
                var userAnswers = $("input[name = 'answer']:checked");
                var userAnswersIndexes = [];
                for (var i = 0; i < userAnswers.length; i++) {
                    userAnswersIndexes.push(userAnswers[i].value);
                }
                if (userAnswersIndexes.sort().toString() == currentQuestion.correctAnswerIndex.sort().toString()) {
                    result++;
                }
                break;
            }
        }
        var nextQuestion = chooseRandomQuestion(questions);
        if (nextQuestion != -1) {
            showQuestion(nextQuestion);
        } else {
            showResult();
        }
    } else {
        alert ("Choose your answer");
    }

});
var intervalId;
function startTimer() {
    var time = 20;
    $("#timer").text(time);
    $("#current-progress").css({"width": "100%", "background-color":"#0000cd"});
    $('#timer').css('color', '#000');
    $("#current-progress").animate({width:0}, time*1000, 'linear');
    intervalId = setInterval(function () {
        if (time > 0) {
            time--;
            $('#timer').text(time);
            if (time <= 5) {
                $('#timer').css('color', '#F03');
                $("#current-progress").css('background-color','#F03');
            }
        } else {
            clearInterval(intervalId);
            var nextQuestion = chooseRandomQuestion(questions);
            if (nextQuestion != -1) {
                showQuestion(nextQuestion);
            } else {
                showResult();
            }
        }
    }, 1000);
}
function stopTimer() {
    clearInterval(intervalId);
    $("#current-progress").stop();
}
function chooseRandomQuestion(){
    questions = questions.filter(function(item){
        return !item.shown;
    });
    if (questions.length > 0) {
        var index = Math.floor(Math.random() * questions.length);
        console.log("next:" + index);
        questions[index].shown = true;
    } else {
        index = -1;
    }
    return index;
}
function showQuestion(index) {
    var container = $('.question');
    container.html("");
    var currentQuestion = questions[index];
    $("#next").attr('data-question-id', index);
    switch (currentQuestion.type) {
        case 'radio': {
            container.append("<p>" + currentQuestion.question + "</p>");
            for (var i = 0; i < currentQuestion.answers.length; i++) {
                container.append("<input type='radio' name='answer' value="
                    + i + ">"
                    + currentQuestion.answers[i] + "<br>");
            }
        }
            break;
        case 'checkbox': {
            container.append("<p>" + currentQuestion.question + "</p>");
            for (var i = 0; i < currentQuestion.answers.length; i++) {
                container.append("<input type='checkbox' name='answer' value="
                    + i + ">"
                    + currentQuestion.answers[i] + "<br>");
            }
        }
            break;
    }
    startTimer();
}
 function showResult() {
     var container = $('.test');
     container.html("");
     container.addClass('result');
     container.append("<h2> Тест завершен </h2>");
     container.append("<img src='./img/brain.png'>");
     container.append("<h4> Ваш результат " + result + "/" + numberOfQuestions + "</h4>");
     var comment = "";
     if (result > numberOfQuestions/2) {
         comment = "Так держать! Время потрачено не зря."
     } else {
         comment = "Нужно усерднее работать."
     }
     container.append("<h4>"+ comment +"</h4>");
 }

