$(document).ready(function () {

    $('form').on('submit', function(event) {
        var btngen = $('#generator').button('loading')
        var server_play = Math.floor(Math.random() * 3) + 1;
        $.ajax({
                data: {
                    url: $('#url').val(),
                    g_captcha: grecaptcha.getResponse() 
                },
                type: 'POST',
                url: '/generate'
            })
            .done(function(data) {
                $('#form-generate').find('hr').remove()
                if (data.error) {
                    $("#url-error").fadeTo(8000, 500).slideUp(500, function(){
                        $("#url-error").slideUp(500);
                    });
                    $('#url-error').before('<hr />');
                    $('#url-error').text(data.error).removeClass('hidden');
                    $('.stepwizard-step a[href="#step-1"]').trigger("click");
                } else {
                    $('#url-error').addClass('hidden');
                    $('#url-valid').removeClass('hidden');
                    $('#video-info').removeClass('hidden').after('<hr />');
                    $('#video-url').val(data.video_url);
                    $('#video-public-url').val('https://s'+server_play+'.vilog.me/watch?v='+data.public_code);
                    $('#view-video').attr('href', data.video_url);
                    $("#generate-form").addClass('hidden');
                }
                btngen.button('reset');
                $('#url').val('');
            });
        event.preventDefault();
    });
        
    var navListItems = $('div.setup-panel div a'),
            allWells = $('.setup-content'),
            allNextBtn = $('.nextBtn');

    allWells.addClass('hidden');

    navListItems.click(function (e) {
        e.preventDefault();
        var $target = $($(this).attr('href')),
                $item = $(this);

        if (!$item.hasClass('disabled')) {
            navListItems.removeClass('btn-primary').addClass('btn-default');
            $item.addClass('btn-primary');
            allWells.addClass('hidden');
            $target.removeClass('hidden');
            $target.find('input:eq(0)').focus();
        }
    });

    allNextBtn.click(function(){
        var curStep = $(this).closest(".setup-content"),
            curStepBtn = curStep.attr("id"),
            nextStepWizard = $('div.setup-panel div a[href="#' + curStepBtn + '"]').parent().next().children("a"),
            curInputs = curStep.find("input[type='text'],input[type='url']"),
            isValid = true;

        $(".input-group").removeClass("has-error");
        for(var i=0; i<curInputs.length; i++){
            if (!curInputs[i].validity.valid){
                isValid = false;
                $(curInputs[i]).closest(".input-group").addClass("has-error");
            }
        }

        if (isValid)
            nextStepWizard.removeClass('disabled').trigger('click');
    });

    $('div.setup-panel div a.btn-primary').trigger('click');
    
});

function enableBtn(){
    $("#generator").removeClass('hidden');
    $("#gCaptcha").addClass('hidden');
}

$('.copy').tooltip({
    trigger: 'click',
    placement: 'bottom'
});

function setTooltip(btn, message) {
    $(btn).tooltip('hide')
        .attr('data-original-title', message)
        .tooltip('show');
}

function hideTooltip(btn) {
    setTimeout(function() {
        $(btn).tooltip('hide');
    }, 5000);
}

var clipboard = new Clipboard('.copy');
clipboard.on('success', function(e) {
    setTooltip(e.trigger, 'Copied!');
    hideTooltip(e.trigger);
});
clipboard.on('error', function(e) {
    setTooltip(e.trigger, 'Failed!');
    hideTooltip(e.trigger);
});