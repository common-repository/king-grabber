		var limit_api = 5;
		var $ = jQuery;
		function ktg_change(){
			var host = jQuery("#ktg_host").val();
			jQuery('.howto').show();
			jQuery('.myhosto').html(host.charAt(0).toUpperCase() + host.slice(1).toLowerCase());
		}
		
		function ktg_trigger_grab(url) {
			jQuery("#poststuff #ktg_source").val(url);
			ktg_js_grab();
		}
		
		function ktg_js_grab() {
			var host = $('#host_id').find(":selected").val();
			var url_position = jQuery("#ktg_source").offset().top-100;
			
			var url = jQuery("#ktg_source").val();
			var regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
			if(regex.test(url) != true || host =='') {
				alert("Some parameters is required to start grabbing");
				return false;
			}
			jQuery('#content-html').click();
			jQuery("#ktg_message").html('');					
			jQuery("html, body").animate({ scrollTop: url_position }, "slow");
			jQuery("#ktg_grab_button").text("Wait..").prop("disabled",true);
			jQuery("#ktg_source").prop("disabled",true);
			var data = {
				'action':'ktg_grab_content',				
				'url':url,
				'host':$('#host_id').find(":selected").val(),
			};
			jQuery.ajax({
				data:data,
				type:"POST",
				timeout: 15000,
				url:ktg_object.ajax_url,
				success:function(res) {
					if(res.status != 'success') {
						errMsg(res.message)
						jQuery("#ktg_grab_button").text("Grab Chapter").prop("disabled",false);
						jQuery("#ktg_source").prop("disabled",false);
						return false;
					}
				
					jQuery("#poststuff #title").focus().val(res.title).blur();		
					// var cont = tinyMCE.get('content');
					// cont.setContent(res.content);
					jQuery("textarea#content").val(res.content);
					jQuery("#ktg_grab_button").text("Grab Chapter").prop("disabled",false);
					if(jQuery( "[name='meta_chapter']" ).val()) jQuery("[name='"+jQuery( "[name='meta_chapter']" ).val()+"']").val(res.chapter);
					if(jQuery( "[name='meta_judul']" ).val()) jQuery("[name='"+jQuery( "[name='meta_judul']" ).val()+"']").val(res.title);
					if(jQuery( "[name='meta_komik']" ).val()) jQuery("[name='"+jQuery( "[name='meta_komik']" ).val()+"']").val(res.judul);
					jQuery("#ktg_source").prop("disabled",false);					
					setTimeout(function() {
						jQuery("html, body").animate({ scrollTop: 0 }, "slow");
					},600);	
				},
				error: function(request, status, err) {
					alert("Ops sorry : "+status+" "+err);
					jQuery("#ktg_grab_button").text("Grab Chapter").prop("disabled",false);
					jQuery("#ktg_source").prop("disabled",false);
				}
			});
		}
		function ktg_api_check() {
			var apikey = jQuery("#api_key").val();
			if(apikey=='') {
				alert("API Key needed for this action");
				return false;
			}
			jQuery("#check_multi").text("Waiting..").prop("disabled",true);
			jQuery("#api_key").prop("disabled",true);
			var data = {
				'action':'ktg_api_check',				
				'api_key':apikey
			};
			jQuery.ajax({
				data:data,
				type:"POST",
				timeout: 15000,
				url:ktg_object.ajax_url,
				success:function(res) {
					if(res.status != 'success') {
						errMsg(res.message)
						jQuery("#check_multi").text("Check API Key").prop("disabled",false);
						jQuery("#api_key").css("border-color","rgba(244, 67, 54, 0.62)");
						jQuery("#api_key").prop("disabled",false);
						return false;
					}
						sucMsg(res.message)
						jQuery("#check_multi").text("Check API Key").prop("disabled",false);
						jQuery("#api_key").prop("disabled",false);
						jQuery("#api_key").css("border-color","rgba(0, 255, 0, 0.21)");
						jQuery("#status_key").val(1);
				},
				error: function(request, status, err) {
					alert("Ops sorry : "+status+" "+err);
					jQuery("#check_multi").text("Check API Key").prop("disabled",false);
					jQuery("#api_key").prop("disabled",false);
				}
			});
		}

		function ktg_js_single() {
			var host = jQuery("#ktg_host").val();
			var url = jQuery("#series_url").val();
			var regex = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
			if(regex.test(url) != true || host =='') {
				alert("Some parameters is required to start grabbing");
				return false;
			}
			jQuery("#check_multi").text("Wait..").prop("disabled",true);
			jQuery("#series_url").prop("disabled",true);
			var data = {
				'action':'ktg_multi_content',				
				'url':url,
				'host':$('#host_id').find(":selected").val(),
			};
			jQuery.ajax({
				data:data,
				type:"POST",
				timeout: 15000,
				url:ktg_object.ajax_url,
				success:function(res) {
					if(res.status!='success') {
						errMsg(res.message)
						jQuery("#check_multi").text("Grab Series").prop("disabled",false);
						jQuery("#series_url").prop("disabled",false);
						jQuery("textarea#list_multi").val('');
						jQuery("#title_series").html('');
						return false;
					}
					jQuery("textarea#list_multi").val(res.content);
					jQuery("#total_found").html(res.total);
					jQuery("#totaled").html(res.total);
					jQuery("#title_series").html(res.title);
					jQuery("#chapter_div").show();
					jQuery("#multime_form").show();
					jQuery("#check_multi").text("Grab Series").prop("disabled",false);
					jQuery("#series_url").prop("disabled",false);
					jQuery("#ktg_message").html('');					
					setTimeout(function() {
						jQuery("html, body").animate({ scrollTop: 0 }, "slow");
					},600);	
				},
				error: function(request, status, err) {
					errMsg(status+" - "+err)
					jQuery("#check_multi").text("Grab Series").prop("disabled",false);
					jQuery("#series_url").prop("disabled",false);
				}
			});
		}
		function errMsg(msg){
			$('#ktg_message').html('<div id="error-kgg" class="error notice is-dismissible"> <p><strong>'+msg+'</strong></p><button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>')
		}
		function sucMsg(msg){
			$('#ktg_message').html('<div id="success-kgg" class="updated notice notice-success is-dismissible"> <p><strong>'+msg+'</strong></p><button type="button" class="notice-dismiss"><span class="screen-reader-text">Dismiss this notice.</span></button></div>')
		}
		var ajaxCall;
        Array.prototype.remove = function(value){
            var index = this.indexOf(value);
            if(index != -1){
                this.splice(index, 1);
            }
            return this;
        };
        function enableTextArea(bool){
            jQuery('textarea#list_multi').attr('disabled', bool);
        }
        function suksesUp(){
            var count = parseInt(jQuery('#sukses_count').html());
            count++;
            jQuery('#sukses_count').html(count+'');
        }
        function gagalUp(){
            var count = parseInt(jQuery('#gagal_count').html());
            count++;
            jQuery('#gagal_count').html(count+'');
        }
        function TotalUp(){
            var count = parseInt(jQuery('#total_count').html());
            count++;
            jQuery('#total_count').html(count+'');
        }

        function Hentikan(bool){
            jQuery('#loading').attr('src', 'data:image/gif;base64,R0lGODlhAQABAPcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAP8ALAAAAAABAAEAAAgEAP8FBAA7');
            var str = jQuery('#checkStatus').html();
            jQuery('#checkStatus').html(str.replace('Checking','Stopped'));
            enableTextArea(false);
            jQuery('#submit_kg').attr('disabled', false);
            jQuery('#stop').attr('disabled', true);
            jQuery('#checkStatus').html('');
            if(bool){
                alert('Completed');
            }else{
                ajaxCall.abort();
            }
            ubahTitle('Plugin Grabber');
        }
        function ubahTitle(str){
            document.title = str;
        }
        function ubahTextbox(mp){
            var uritext = jQuery('textarea#list_multi').val().split("\n");
            uritext.remove(mp);
            jQuery('textarea#list_multi').val(uritext.join("\n"));
        }
        function Gthread(lstURI, curURI,  gImg, maxFail, failed ,idmanga,host,ptype,cate,delay){
            
            if(lstURI.length<1 ||curURI>=lstURI.length){
                Hentikan(true);
                return false;
            }
            if(failed>=maxFail){
            
                Gthread(lstURI, curURI, gImg, maxFail, 0, idmanga,host,ptype,cate,delay);
                return false;
            }
            ubahTextbox(lstURI[curURI]);
            ajaxCall = jQuery.ajax({
				url:ktg_object.ajax_url,
                dataType: 'json',
                cache: false,
                type: 'POST',
                beforeSend: function (e) {
                    ubahTitle(lstURI[curURI] + ' Plugin');
                    jQuery('#checkStatus').html('Trying : ' + lstURI[curURI]);
                    jQuery('#totaled').html(lstURI.length);
                    jQuery('#loading').attr('src', 'data:image/gif;base64,R0lGODlhUABQAPcAAAAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODhsTFCkZGlMoK3U0OZRARbFKUcVRWdFVXdhYYNxZYt9aY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BbY+BbY+FbY+FbZOFbZOJdZORjZuZrbOdycuh2deh3dul4dep5c+17bfB8aPF9ZfJ+Y/N+Y/N/ZPKAZvODavOJcfOOd/SSfPSWf/WZg/WchvWdiPWdifWei/SejPSfj/OgkvKglfKhmPGim/Cin++ioe+jpO+lpvCoqfGtq/KxrPS4rfa7rve+rfe/rffArvfBsffCs/bDtvbEuPbEu/bFvvXFwvbIxvbLy/fR0PjV1Prg3/vm5P3z9P76+v7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////yH/C05FVFNDQVBFMi4wAwEAAAAh+QQJAwBuACwAAAAAUABQAAAI1wDdCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKj3p5ckTL0rHyFhBdYWMMUinVqUqQ2GVIUOu5PSydSvUg1VyqM1RBaeTslWdIByyNscQhlasqHwLd4Xcg3TX3l2YVyXZvmcNpl3bFqfWrV0Tfh3SGKdUyFiTenHiJPHSz6BDix5NurTp06hTq17NurXr17Bjy55Nu7bt27hz697Nu2hAACH5BAkDAHkALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERETUeIIw9QsBPV9VXX91ZYuBaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+BaY+FbY+FbY+FbY+FbY+FbY+FbY+JdY+RgY+hnYuxvYe91YfF5YPJ7YPN9YPN9YPN9YPN9YPN+YPN+YPN+YPN+YPR/YPSBYPSEYfSIYvSLY/SMZPSQZvOSafOSbPGQcO+Rdu6Pe+yOf+uMguqJhemHh+mGiOmGiemHiumIi+mJjemKjumLj+qNkeqPk+qRleuTl+uVmuyYneyan+2gpO+mqvGws/K4u/TAwfbFxfbIx/fLyvfNzPfOz/jT0vnX1PrZ1fvc1/vf2fzi3Pzl3v3r4/3t5f3u5v3v5/3v5v3w5f3w5f3w5v7x6P7z6/7z7P728f749f78+/7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wjmAPMIHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqNeklyYgRSbwkpfK06ggqCt+QIfMmpxerVqUe7EKjLI0uOJ2CfZrk4BuzZrsqZMNG5VqrB8fALTtm7o8fdVHerZp3L42+Cdn8DXxS7dq2Bt/ulZuY8cmvd8UaJGsWLU6qYLEmfDNmDGWcTdlqXsq6tevXsGPLnk27tu3buHPr3s27t+/fwIMLH068uPHjyJMTDQgAIfkECQMAcAAsAAAAAFAAUACHAAAAGwsMtkpR01Ve4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Vtk4Vtk4Vtk4Vtk4Vtk4Vtk4Vxl4Vxl4V1m4V5n4mFn5GNm5WZm52lm6W1l7HFk7nVj8Hhi8Xph8nxg831g831g831g831g835g835g835g835g835g835i8n9l8oBp8INw74Z47ol+7ouE7Y2H7I6L7I+N7ZGM75OL8JaJ8piH85qF9J2D9aGC9qSC9qiD96yE96+D97GE+LSG+LaK+LmO+LyS+LyV+b2Y+b6b+b6c+cKe+cSk+car+Miz+MzA+NHJ+NXP+NfU+drX+dzZ+t/d+uLg++Xi/Ofk/Onm/Ovm/ezo/e7q/e7q/e/r/e/r/e/s/fDt/fHu/fLw/fPx/fPy/fTz/fT0/PX0/PX1/Pb2/Pf2/Pj3/Pj4/Pn4/fr5/f38/v39/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4A4QgcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIk4Yk48QJGaVkYiyYuiDGU6NkKlClWuGqwSxDbtwYkgWn1K1UYxzMMqKt27I1yaBF63WgELduhSiUYsSIFJRN5m5tYvAG3rY3FBrhwcNIwzRpMgYWPJVwQcOHEydc3PhxZIxyKS+oK/DuYb0J+fpNeXau2q+HR8CNqxVtV4RZhIgVMttm1K1WoTZpQlqp8ePIkytfzry58+fQo0ufTr269evYs2vfzr279+/gwwWLHy8xIAAh+QQJAwCJACwAAAAAUABQAIcAAAAbCwywR07cWWLgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPhW2ThW2ThW2ThW2ThW2ThW2ThW2ThXGXhXWbhX2jiYWniY2ziZm7jaXHja3LkbHLlbnHncHDpcm7qdGztdmnveWXyfGHzfWDzfWDzfWDzfWDzfmDzfmDzfmDzfmDzfmDzf2HzgGLzgWTzgmX0g2b0hWb0hmf0iGf0jGj1lGj1mWn2nWr2omr3p2r3q2v3r2v3sWz3smz3sm33snL3s3j2s4D1tIn0s5TzsqDysqfysqrysq7ztbD0t7P1urT3vrb3wLf4wbj4wrj4w7j4xLn5xrv5yL75y8P5zsj40Mz40tD41NT41db41tf42Nf52Nj52dj529j63Nj63dj739j64dn549r55dz56N346t/37eD47uH67+L78OP88eP88eT98eT98eX98ef98uj98ur98+z98+799O/99fL99fP99/X99/b9+Pf++/v+/Pz+/fz+/f3+/v7+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gATCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTgtTjhQkTL3qSegERoWoEEF4Wlimj04vVrxGyHrTCouwNKzf1UAVbFUTUgmTLykWrME6clF7ZWhU7cI/cvzcUHhEi5AhKJnqtMilY5u9frgfjECZ8d+GaNRkRJ46wmGBjx2UhG5Q8ubLCyxnzJuY78AbowAkHF0apNrFbg3H/0k1oV6VqsKwJWnHN4mzOqV+xahWdk6lTqEqjS59Ovbr169iza9/Ovbv37+DDEosfT768+fPo06tfz769e4sBAQAh+QQJAwB3ACwAAAAAUABQAIcAAAAcCwyqRUvNU1vgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPhW2ThW2ThW2ThXmfiYWriZG3jZ2/kanDlbW/nb23pcmzrdWrtd2jveWXyfGLzfWDzfWDzfmDzfmDzfmD0fmD0fmD0f2H0gGP0gmX0g2f0hGj0hmn0h2r0iGr0i2v0jWz1km31lm32nW32o233qG33q2z3rmz3sGv3sWv3smv3smz3s2/3s3P3s3f3snr3sn73r4P3roj3rY3zrpDxspPuuJbsu5jovZrlv5vqwZ7uwqDxxKLywqX0vqr1uq31ua/ztrHzuLX0u7n0v7/1xsb1ycv2y832zM/2ztD30dL41NX41tb419j529v639774+L86+r98fD+9PP+9fP+9vT+9/X+9/X+9/X+9/X+9/X+9/X+9/X+9/b+9/b++Pb++Pf++ff++fn++vr++/v+/f3//v7//v7//v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gDvCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTghxj5ckTK2OSbrnwoOqDC1sSkmkSJEgTMji3WB37IKtBLipGqB2hwovNMVTJVr0QlSCZtGvVqgB78I2SHj2UvDlZRe7YKgWb5M3bBKESHJBxKDn5xLDVJwWDLF4bBGGPyDh6MDxyJGNlyw8wE9S8eUTng58ji15IOmNh1IgJKm7d+ODjyJNNwrVMt+DdzS74GvQLWDBKsYbNFvSCV6/bm1PHYtXK1avym2OqKjitUlep+fPo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggBQFBAAh+QQJAwC3ACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCg0LCw/LzBdODp1PkKgSlC6UVjMVl7WWGHcWWLeWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgW2TgW2TgW2TgW2ThW2ThW2ThW2ThW2ThW2ThW2ThXGXhXmfiY2viZ2/janLjbXXkb3fkc3rldHvmdXrndXfodnTpdnLrd2/teGrvemfxfGTyfWLzfWDzfWDzfWDzfWDzfWDzfWDzfmDzfmDzfmDzfmD0fmD0fmD0f2L0gGL0hGb0h2j1jm32l3H2oXT3pnX3qXL3rW73sGz3sWr3sWr3sWr3sWr3sWr3sWr3sWr3sWr3sWr3sWr2sWr1sWvvsm3psm/js3HdtXfUuH3Nu4LPvYzWvpfcv6HiwKjrwbPxwrnzw7z0w771w7z2xLv3xrn4x7b4ybP4yrH5y7D5zbD5zrD5z7L50bP51Lb51rn52Lv42r713MHy3cPu38br4Mjo4crm48zk483j5M/j5NDk5NHn5NTr49bv4trz4t314d734eD44eH54eH54+L65OP65uT76eX86+b87uf98Of98ej99e39+PH9+/f+/Pr+/fv+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/gBvCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iThkR16BAqpaia/Jj6o8lThIrOhAlzRhFOVEeoUj3S6qCarWjDqFH4ypKlVymliqXaxKCitGm9HnTkpq8bSCdRzZ17daBWvFvRHHzl1y/chLM+fZqF8dBgsYcKIk570FLjvpYUevrzx1Ply1QzE9yMtvNnN6ETji6NUTDqH4UFHkas2CDjz48RzvJkOqPcwXUL3t2s1yCkxoADh51L1izitQnbvlUZVWyTsljRLCRu/rVpbqXo06tfz769+/fw48ufT7++/fv48+vfz7+///8ABijggAQWOFFAACH5BAkDAKEALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGSYdHlEsLoo/RLNMU8xUXNhYYN1ZYt9aY+BaY+BaY+BaY+BaY+BaY+BaY+BbZOBbZOFbZOFbZOFcZOFdZuFeZ+FfaOFgaeFia+JkbOJkbeJlbuJmbuNpbuRrb+Zubuhyb+p1be14avB7ZvJ9Y/N9YfN9YPN9YPN9YPN9YPN9YPN9YPN+YPR+YPR+YPR+YPR/YfSAY/SFafSJbvWNcvWTd/acfvaigfelgveogvevhPi1hPi6hPi+hfi+g/i8gfi7fvi5efi4dvi2dPi1cvi0b/ezbfezbPeyaveyaveyaveyaveyavSya++zbee1cdy4d8+8f8LAh73DjrvFkrrFlLvGlbvGlr7FmcHEmsfBnc+9odW6o9u4p+G3q+a3ruq2sey2s+64tfC8uPLCvfXJwvjPx/nUy/rXzfvb0Pve0vvg1Pzi1vvl2Pnn2vjo3fnp3/vq4vzr5Pzr5fzr5/zr6Pzr6fzr6vzr6vzs6v3t6v3t6/3u6/3u6/3w7f3x7v3y7/708v76+P78+/7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AEMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJOKhASpYaVAgSrt1DNDhYoZehJWgmKkqxEoUm/msEpWRY6DlZZ49bokrMFDVrhwsXIIpZ6yZbMW5LrWK5SDh8IIHlzXZFW8VmcUrNS3r9uBVgYPtqIQERw4iDBCQly26cBAjdcGMthFsmAuCuGwYQNHM2eyngWCDt11dMHSprukXt0a42HEigkypm3kscDIpikntIw5413Oegnybfz3rekwhU2OxXvWYNrGbRE7wu3Sha5Kqomje5/+1bhNpk6huldKv779+/jz69/Pv7///wAGKOCABBZo4IEIJqjgggw26OCDEEYYSkAAIfkECQMAwAAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYJR0dWi8xhD1BpEdNyFNb2Vhh31pj4Fpj4Fpj4Fpj4Fpj4Ftk4Ftk4Vtk4Vtk4Vtk4Vtk4Vxl4V5n4WBp4WJq4mJq4mRq42Vp52pn7HFk73di8Xph83xg831g831g831g831g831g831g831g835g835g835g835g835g9H5g9H9i9IFk84Nn8oRt8IV07oZ77YZ+7Yd/7YeA7ol98It78o1485J285Z09Z9w9qVu96ts969q97Fq97Fq97Fq97Fq97Fq97Fq97Fq97Fq97Jq97Jq97Jq9rJq9LJq8LNs5bRv17ZzyLh4u7p7tbt9sLx/rryArLyArLyArLyBrryCr7uDsrqEt7iHvLaKxbOQz7CV1q2Z26uc4aqg6Kmk66mn7aqo76yq8bCr8rOs87as9bqt9r6u98Cv98Kw9sSw9Max88my8My078217c+27NG46tO75te+49rB4dzD5d3F69/I8eDL9eHM+OHO+uHR++DT/N/V/ODV/OHW/OLX/OTY/OXa/Ojd/evg/e3j/O3l/O7m/O7p/O3q++7r+u/r+vDs+fLs+PPt9/Xu9vbu9vfv9/fw9/fw+Pjx+fjy+vjz+/n0/Pn1/fj1/fn1/Pr2/vz5/v38/v38/v39/v79/v79/v7+/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AgQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIk8KEZQkQIEuwdILCs2QJHlAJKT0RwlXIE0oKOUWKxEnloBcm0pp4Meggpa5whYA1GItQl7tdCMU6CQqt2rQvsBKEtTUu1ydRC9rFe5eQQlSMGKHKiOfvXzwF3xruOncgJ8aMyx5ExaY0m8kXl1hWu6QgoM1dARWMBBqvJISMTLNhhFH1ahOtCb6GLUQ2Qdq1u9w+mNs074uVf2MmqBl2Z4Gfk4s2SNo0aot9V10HLgjLCWwniQkuZuw4IWTJGs/+ZevW+sG67PeinFr1albzXTlxnUGcSCLJdjjBQolTlKSn1IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okopqjiiiwOFBAAIfkECQMAmgAsAAAAAFAAUACHAAAAAQEBAgICEAgISh8iejM3sUhPzFNb2Fdg3Vli31pj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Fpj4Vtj4Vtj4Vtj4l1j5mRi621h73Zg8ntg831g831g831g831g835g835g9H5g9H5g9H5g9H5g9H5g9H5h9IBj9IJl9IVo9Ihr9Itt9Y5v9ZBw9ZNv9ptu9qJt96pr97Bq97Fq97Fq97Fq97Fq97Jq97Jq97Jq97Jq+LJr+LJs+LNs+LNt+LNt+LNs+LNt9rNt8rRv6rVx1rh3xbt9urx/s72BsL2Brb2BrL2BrL2BrL2BrL2Brb2Crr+FscGIs8KMtcSQt8aTuceWvceawcecyMaf0MOj2b6l4Lin5rSp66+q7a2q76yq8bCr8rSt9buu9r+u98Kq+MSn+Maj+cqi+cym+tCr+tKx+tS5+tfA+dfE+tnG+trK+93O+97R+97T+97W+97X+9/Y+9/a++Db+uHe+uPg+ebi+Ork9+zm9u7n9vDo9vHo9/Pp9/Tq+PTr+fTr+vTs+/Tt/fXu/fXu/fXv/fXx/fXy/fby/vf0/vf1/vj2/vn4/vr5/vv7/vz8/vz8/vz8/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ANQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIk8J8dKdMmTuPdu5582aPQjsvRmgd8cJOQkRr0qRZgyjlozAV0lYIE9Wgna1wR3g1KAdIjrs5gMhBiVZt2jAGH2WNq/VF24GI7OK9C6TswUBXmjTJEgjjHr9+rRJ8S3jr3IFrFi9egzCy5MkYy2BW+6Zgmc5byxRMIxpvGoSnT6denbY1wdewR8gmSLt2jtsHc0u2zLuC5oGcYX8WGNo46YNZcmfJ2Ncv4IKPXFjAdnFYYOLajREGyj65Msaz3stDl36w7mK9KqdWvSp+q4vpBYElFlk6PWKHU3bIp9SCDDbo4IMQRijhhBRWaOGFGGao4YYcdujhhyCGKOKIJJZo4okoahIQACH5BAkDALAALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhIUIrLYI/Q6pLUcNSWtNXX9pZYt5aY+BaY+BaY+BbZOBbZOBbZOFbZOFcZeFdZuFfaOFgaeJiauJjauRnaeltZuxyZO93Y/J7YfN9YPN9YPN9YPN9YPN9YPN9YPN9YPN+YPN+YPN+YPN+YPN+YvN/ZPKAZ/GBbO6Cde2De+yEf+uFg+yHhO2JhO+NhPGUhPOZg/SdhPSgg/WkgvapgPevf/e0ffi3evi4d/i3dPi2cvi1cPi0bvizbfiya/iyaveyaveyaveyaveyaveyaveyaveyavayavCzbOW0b8+3drS7fq28gKu9gau9gau9gau9gau9gau9gau9gau9gay+g66/hbDAiLLBirXDjbvFkcPIl83MndTPpN3TquPVr+rXs+jYtefauePbvN/dv93dwNzewtvfw9zfxd7exeDexePdxubdx+jcyOncye3by/HazvTZ0PbZ0ffZ1PfZ1fjb2Pne3Pri3/vo5f3t6P3u6v7v6/7v6/7v6/7w6/7x6/7y7P7y7P7z7P707f707f727/748v748/759P759f769v77+P79+/7+/f7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGEJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJPG5DRpEqeGpEjt5CQliNUgUp4iDLQFDJgtgVRWYkKDBpNKCDkhuXoVidaCWLzKBYNFYSJEiBJprOSir1+0BquyvSrFYKC5c8Me3OOmsZs9GZn49cvEIKfBg98K7IrY65aDiRw71nuRxuS+NAxOwsx2EkFSnedKLYhIdGNEGE2fTl1wNWurrgfCju11NsHatnFflHy6csHLv4NohsW582eDoW2Ttsj3NOCCgjFUFy54OLZig4wdQ844tuzZtEcwH5kuMC7iugnv5lVJlW3WhFx5dh5OTDkFlXFKJajgggw26OCDEEYo4YQUVmjhhRhmqOGGHHbo4YcghijiiCSWuGFAACH5BAkDALIALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhIUMrLXY7P5hFS7NNVMVTWtFWXthYYdxZYt9aY+BaY+BaY+BaY+BaY+BaY+BaY+FbY+FcY+NfY+ZlYupsYe92YPJ7YPN9YPN9YPN9YPN9YPN9YPN9YPN9YPN+YPN+YPN+YPN+YPR/YfOAY/OBZfOCaPOGbvKJdPONePOVffSdfPWkevaqdfevb/exbPexavexavexavexavexavexaveyaveyaviyaviya/izbPizbvi0cPi1cvi2dPi4dvi5ePe6e/e7ffW8f++8f+m8f9y9gMy9gsC9gbi9gbK9ga69gay9gau9gau9gau9gau9gau9gau9gau9gau9gau9gau9gqy+g66/hbDBiLHCirLCjLTDjbXDjrnDkcDDlsjCnM7BoNXBpd2/q+O+r+i9su28tvG8uPS9ufXBuvbDuvfFu/jHu/jKvffPv/bSwfPWxOzcxu/eyPLfy/bfzPjgzfngz/vh0frh1vri2vrj3Prk3vvl4Pvn4fzp4/zr4/3t5P3v5P3w5f3x5f3x5f3x5f3x5f3y5/7z6P706/727v758/759f78+f79+/79/P7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AGUJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMGHVWp0qidjJL8+JGEUcJRY7BoxTLmaUpOhw5xUrhkqtkfSw6O8rJ1q5dUCCP1adOmTySNSmLojaEEIaOzZ60WzNp265iDkegqbnP3Iqe9e8caRALYbF+CowoX9kpw7uK6GA9B1nvoYOWzBStpblvJ4GfFoUfHKG3wtNnUq7e2LviaLsbHoyUXpHz68sDMubFwHuh5cZ+MefcaL/j3tGCChDUfNpj4c+PfYYVFHywLOK3BUV00d4GL2LNdlYyUTFVy/Xx2ruyRMnWqtL///wAGKOCABBZo4IEIJqjgggw26OCDEEYo4YQUVmjhhRhmGGFAACH5BAkDALkALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICwkJUwuMGc3OohBRqVKULpQV8lVXNRYYNpZYt1aY99cZeBeZ+FhaOJja+NobuRrb+Ztb+dvbelxa+x0ae94ZfF7YvN9YPN+YPN+YPN+YPN+YPN+YPR+YfSAYvOBZfODaPOFavOGbPOHbfOJcfOLdPKPe/KTgvGXiPGbjvGckvKekfOgkPSij/WkjvamjfaojPerifeth/evhPexgvizffizefizdPizb/izbfiya/iyaviyaviyaviyaveyaveyaveyaveyaveyaveyaveyavayavOya+uzbd+1cci4eLi7fa28gKu8gKu8gKu9gau9gau9gau9gau9gau9gau9gau9gau9gau9gay9gq6/hbLAiLnEj8LImM3KntrLpOXLqu3KrvHKsPLOs/DRte7Ut+nXueXau+LcvuXdv+jewergxOzhx/DjyvPlzfbn0fro0/vo1fvo1/vp1/vp1/rq2Pjr2fbs2vTs2/Lt3fHt3fHt3vHu3/Lu4PTv4fbw5fjy6vv07vz28f328/339P339f749f759f759v759v359v369vz69/z69/z9+/39/P39/P3+/f7+/v7+/v7+/v7+/v7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wj+AHMJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMCRQWJECFIqHSaEuTEiSBTCStV2cJ1S5VKCjkhQsRJpaQgONLiCALWYKWucLe0Lciqz5u7b/qwylhKSYwYSkohNIVWbdogWAmi2hqXa5WoBe3ivdsno5IVmFcoQSjIsGFBBSE1hgupIKfJk8tejJF5RQyETjyrdVKQ0OiuhAoiQo0XEUbWmV8fjC0bB22Ctm9vyU1wN+83vi9ezrz5YOfioAmKVl6a4Onnqi1c9v0beHBhw0USD1x8+7FByZP9oKx0fu1cgm9H3x9Yd7LelFNVdVVWjDm2n2ljhYcTU05BpdSDEEYo4YQUVmjhhRhmqOGGHHbo4YcghijiiCSWaOKJKKao4ooiBgQAIfkECQMAtQAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaMiIjSCosXDAzbDY6gT1Ck0NIpUhPsk1Uv1FYyVRb0FZe1Vhf2Vlh3Fpi3lpi31tj4Ftj4Ftj4V5l42Jm5WZn52xq6XFs6XRv6nZw63hw7Xpt7ntr8Hxn8n1k8n5i835h835g835g835g9H5g9H5g9H5h9IBi9INk9Ilm9ZNo9p5p96lp965p97Bp97Fp97Fp97Fp97Fp+LJq+LJq+LJq+LJq+LJq+LJq+LJq+LJr+LNt+LVw+LZz+Lh2+Lh3+Ll4+Ll49bl47bp647p72rt9z7t+wrx/ubx/sryArryArLyAq7yAq7yAq7yAq7yAq72Bq72Bq72Bq72Bq72Bq72BrL6Drb+FsMGIs8ONtcWRuMeVvcqbwMuexMyhyMykzsum18qq4smw6Miy8ci19cm298q2+Mu3+My3+c+3+dG3+dG4+NK699S899fA9trF9d3K9N7N89/O8eDO8OHO8eLQ9OXT9ubV9+jW+urY+enZ+enb+ejc+Off9+fh9+fi9ujj9uvn9+3p+e/s+/Hv/PTz/fj2/vv5/vz6/vz6/vz6/vv5/vv4//v4//v3//v4//v4//37//79//7+//7+//7+//7+//7+//7+//7+//7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AawkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkwJFNYkQoUmoeEaKtHCSliZYm2iZlJBTHjp08nBSGciH2SGBEE7KyrYJV4OO1Mid62hjpkwLy5rdm7YgqqttsWqJSpDT3MNqxmKcsWLFjISg9koeYnBt4KxvB+ZBPDcPxkyNG+M9GEmyZKoECV3OSqggHc5y6XwOvWK0wdKmzaIeqHp1k9YEX8OWvbjx44RDclMuaHl1ZoGbYXvOeDdv7r4E/64eXNAwbMUmA0Il94FWrfODcRHXVTm1KmDBz7t/DQv+JlOnUJXq38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IMQRijhhBRWaGGDAQEAIfkECQMAzgAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2QTw8V0ZIaVBSgVxdm2lpsXR0wXx8z4KC2IaG3omJ4ouL5Y2N546O6Y6P6o+P64+O7JCO7JCO7ZCN7Y6J7YyF7omB7oV77YF27Htx7HZs63Np6nBn629l629j7HFi7nRh8Xlh8nxg83xg831g831g831g831g835g9H9h9IJk9IZp9Y5w9ZV49pp99qCD9qKG96aI96qI962I97CB97F497Nw97Nu97Jr97Jq97Jq97Jq97Jq97Jq97Jq97Jq9rJq8bNs4LVwwLl6sLx/rLyAq7yAq7yAq7yAq7yAq7yAq72Bq72Bq72Bq72Crb+FsMGIssKLtcONucSPvsWRwsaSxcaSy8aT0saT18eU3ciV4smX6cmY6MqZ58uc5c2e486h4s+k39Ko3dSs3Ney3Nm339q849zB597F7ODL7+LQ8uPU9OPX9uLZ9+Pa9+Xa9+fc9ene9ezh9u3i9+/k+e/m+u/o++/p/PDq/PDr/fDs/fDs/fHt/fLu/fPv/fXx/ffz/fn1/fr2/fr2/fr2/fr2/Pr2/Pr2/Pr2/Pr2/fr2/fr2/fr2/fr2/vr2/fr2/fr2/Pr3/Pv4/fz5/v37/v38/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AnQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkwYlZsoUsYaoUO0kJumN1TeSnh48timQ10CbjqWElcaMmTSwEBJjc/UqG60Ejyn6+lWRWJOwvOjdm9Zg1bZXJRnsSvfrpoyjiBAZpTDN3r1pDBIDDBiuwMKFMxKZMoWIwjKP9ZYxaIpyW1MEUWGmqwrj5s6fQ3sZXbC0aauoB6pe7bX1xcSLG8uOXHDy7TeWnfH2ejJv6L4F/1IWXJAw5sPN05Qpg1YtW8BvDTnKxWz3JtW2WRFypRtWJ1OnUH0rnU+/vv37+PPr38+/v///AAYo4IAEFmjggQgmqOCCDDbo4IP2BQQAIfkECQMAhgAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJFw4PJBQVMBkaOx0fRCIkVyorZzEyhD48o0xIu1ZRzV1Y12Fc32Vf5Wpg6W5g7HNg73dg8Xpg8nxg831g831g831g831g831g835g9H5g9H9g9IFg9Idh9ZFj9p1l96lo965p97Fp97Fp97Fq97Fq97Jq+LJq+LJq+LJq+LJq+LJq+LNs+LVw+Lp5+L6C+cKJ+cSM+cWO+caQ+caS+MaS9saQ8MSN5sKJ2sGIzcCGv76Es72Brb2Bq7yAq7yAq7yAq7yAq7yAq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72BrL2Crb6Err+GsMGJssOMtcWQt8aTuciXvcqbxM+kzdWx09m319u8293B4N7F5uDK6+DN89/P997P+t7R+97S+9/U++HY+uLa+ePa+OTb9uXd9eff9Ong8+vh8e3h8O7i7+7i8e/l8/Dm9fDn9PDn9PDo9PHo9fLq9vLr+PTu/Pf0/Pv5/f38/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ADQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkyo9WGfMmDo71eyAAWOHmoR2uDDZyoSLHZV+1qzxo7AH1bMwehy0w7Utk68nz4yYO+IMQjVo0V4tqNXtVi4a37xZ6IcuXbIGp+aluqNgHb9toV58Y8HC4IRqDM/dW3Ax2oJjIHMdg5GyZYWZNXMm6PksaNFbSZe+nLCwZsQFFS9uTPAxbMkl5dK1exCv59UC+/oFjNKPGjW4D5rNq9YgW8hwbUpljJxg1rZelSc2fbq0vPnz6NOrX8++vfv38OPLn0+/vv37+PPr38+/v///AAYYU0AAIfkECQMA4QAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+SkJBX0pFgFdOn2JVvGxbznNe2ndg5Hph6nth7Xxh731h8H1i8X5i8n5i8n9k8oFm8oJq8YRv8Yd08Il48It+8JCE8JKI8ZSI8peI9JqH9ZyG9Z2F9Z6E9qCB9qN+9qZ596p0961w97Bs97Fr97Fq97Fq97Fq97Fq97Fq97Fq+LJq+LJq+LJq+LJq+LJq+LJq+LJr+LNs+LRv+LVx+LZy+LZz9rh29bl56rp73Lx+zb2BxL2Bvb2Cub2Bs72Brr2Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72Bq72BrL6Drb+ErsCGsMCIscGJssKKs8KLtcONuMOPv8SSyMWWz8WZ1cWc28af48ak68eo7saq8car88Wt9MSu9sWu98ev98mv98yv98+v99Cw99Gx89S07te46tq759y95d2/597B6uDE7uHF8eHH8+LI8ePK8OXN7uXO6+fS6ejU6enW6OrX6evZ6eva6uzc6+3d7O7e7u7f8O/g9PHk9vHl9vLn9/Tp+PXt+vjx+/r2+/v4/Pz6/Pz6+/z5+/v4+vv4+vv4+vv3+vv3+vv3+vv3+vv3+vv3+vv3+vv4+vv4+/z5/P37/f79/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4AwwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkyo1+CxXq1a5nu2UZcqULIW+Kv3Z+qeSL5zC7KQZm8aOsIO+uKr98xWlqCxZRCkUS3asHaZa126tJNWkKCaAmcg9KKtu3asEc+lVmytjlSoMswRmkgWhKcNkTRVstZhrK8eQF0oOXPngZcxpNBPk3PnPZ7+TBxssjBrxQMWtG598G3cu5rsFn+XVy9dm2Lpm0XZue5OqVazDuzI32vRp1KXYs2vfzr279+/gwxiLH0++vPnz6NOrX8++vfv38OPLn08fZkAAIfkECQMApwAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrODEvRTYzUDs2ZEQ8fU5DkVdIoV1MsmRQxGxV1HRZ4Xtc6oBf8IVj8oxo9JRu9Zt09qN996eC96uH+LCK+LGK+LKJ+LOE+LR++LR4+LRz+LRy+LNx+LNv+LNt97Js97Jr97Jq97Jq97Jq97Jq97Jq9rJq87Jr57Rv07d0urp8rryAq7yAq7yAq7yAq7yAq7yAq7yBq7yBq7yBq7yBq72Bq72Bq72Bq72Bq72Bq72Bq72BrL6Drr+Fr8CIssGKtMOOt8SRu8WUvsaXxMebycifzMmi0Mum0s2p1c+t2dS029i63Nq+3t3B4N7E49/G5uDJ6ODK6+HM7uHP8eHR9OHS9ODU9ODV9OHW8+PY8ubZ8ejb7+rc7+ve7uzf7u3g7e7h7e7h7u/i7vDk7/Dl8PHm8PHm8vLo9fPp9vTr+PTs+/Xu/PXu/fXv/fbw/vfz/vf0/vn2/vr3/vr5/vz7/v38/v7+//7+//7+//7+//7+//7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CP4ATwkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkyo9uChPnkU9L11aCMkNmKtg3EDKCagIEyZFACGEhLUsmK0pN21aCOirWyZiDVo1e9VNyh84cABRaOTt1yIGF9EtCxWjIEEMN+XNu/bgJb9upxLMMxhrnoyHEy/G0djgY8hMJA+kXBnM5ZNA8u5N2NevkcClwRQ+qZYt5LgF59K1exNQayO4C5IdjBanVKq6sxY/2vTp0ufQo0ufTr269evYs2vfzr279+/gww6LH0++vPnz6NOrXx8zIAAh+QQJAwC5ACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzNAODZMPTpXQj1qTEKXZE+1dFjMgF3ahmHmjGPsjWPwjmPyjmPzkGT0kmT1mWX2oGb3qGj3rGn3r2n3sWn3sWr3sWr3smr3smv3smv3s2z3s2z3s233s273s272s23zs23vs27ntG/dtXHOt3a9unuxvH+svICrvICrvICrvICrvIGrvIGrvIGrvYGrvYGrvYGrvYGrvYGrvYGsvoSuwIaxwYm2w4y8xI7BxZDHxpLLxpPPx5PVx5Tfx5bnx5ftxpnxw5rwwZvwwZ3sx6DoyqTmzqjj1K3h1rHf2LXd2bjh2rnm27rr3Lzv3L3x3b/x3sHy38Ty4srx5NDx5tTx6dnw6t3y69/y7eLz7eP07eP27eT37eX47ub57uj57+n68Or68ev68u368+778+/79O/79PH89fL89vP99vT99/X99/X99/X9+PX9+PX9+fb9+fb8+fb8+fb8+fb8+vb7+vb7+vb6+vb6+vf6+vf6+/f6+/f7+/j7/Pn8/Pr8/fv9/fv9/fz9/v3+/v3+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I/ABzCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKkWYKNHSVn3CSA3Tp1VOUYLo0BEkCmGrNVOnrrFqUxQUJWiVQOlqMGrYqX1SPqpT55FCQWnTCjr49q1GTpwa1vnxw45COnnR0jGYqG9YRhkBCyZsOCHixIsLNnYsFfLJuXUm3U2sZK9BzlJvms279qDbvnFVZ93K1uDXvmOPQg1bdWkiz0uDCx9OvLjx48iTK1/OvLnz59CjS59Ovbr169iza9/OvTvMgAAh+QQJAwCfACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODhEPTtbSEF3WEiOZE6mcVO/gFnViV7ijmHpkWLukWPwkmPykWPzkGP0j2P0k2T1mGX2nmb2o2f3qGj3rWn3r2n3sWr3sWr3sWr3smv3smz3s233tG73tG/3tG/3tG/2tHDytXDstXHht3TPuHjBunuzu36tvICrvICrvICrvICrvICrvICrvICrvICrvICrvYGrvYGrvYGrvYGrvYGrvYGsvoOuv4WvwIexwYqywouzw420xI+1xZC2xpK3xpO5x5a7yZm9y5zAzaDCz6TE0KbF0ajH0qvJ1K7L1rHP2bfT3L3Y38Pd4sjh5Mzm5tDp6NLs6dTv6tbz69n07Nr27d337uD37+P48OX38Of38ef48uf58+j69ez69u369u79+fP++vb++/f+/Pv+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8I5QA/CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl26UJKfOnX8SOIJCdJCQ2iyajWUsxEWJ06wNEIoSatZNFNTUqLE8CvYsAj9nNXqR60RI2wTQnr7ttLBOnOz1rGLV+Fevk78GgQceLDavArdgsUSNzCauje9Th57sGzgtDgrKU6I9SxXpE6hSmXKurXr17Bjy55Nu7bt27hz697Nu7fv38CDCx9OvLjx48iDBwQAIfkECQMAsgAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGUk1JXVRMaFtOcmJRfGhTjHJXoH5btYpfxZRh0Jtj2aBl4qVm6Kln7ato8K1p869p9bBp9rFp9rFq97Fq9rJq9LJr8bJs6bRu27Zyzbh2wLl6s7t+rbyAq7yAq7yAq7yAq7yAq7yAq7yAq7yAq72Bq72Bq72Bq72Brb6Dr7+Fs8CIusOOwcaWzMeb2Mif4smj7Mqo8suq9cus9sys9sqt9smt9siu9cau9cev9Miw8Myy7M+06dG35tS54ti839u/4N3C4eDG5OPK5+XN6ufQ7unU8erX8+za8+zb8e3c8O7e8e7f8vDj8vLm9fXr9vbt+/r1/Pv4/Pv4/Pz6/P37/f37/f37/f37/f38/f38/f38/f37/P37/P37/P37/P37/P37/f37/f38/f38/f38/v7+/v7+/v7+/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CNMAZQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyjCSIUORlGKas6bqmjmYdDrSo8eRQqpWq87J6UiLWS1eD0YKGzZqSj9+GOo5q0UPQkNsrRpSCVcuXbsH8eZds/dm2bNpDa4d7NYw18QHwYalg3RqWKxKnUJlyrmz58+gQ4seTbq06dOoU6tezbq169ewY8ueTbu27du4ZQcEACH5BAkDAJwALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEBERERISEhMTExQUFBUVFRYWFhcXFxgYGBkZGRoaGhsbGxwcHB0dHR4eHh8fHyAgICEhISIiIiMjIyQkJCUlJSYmJicnJygoKCkpKSoqKisrKywsLC0tLS4uLi8vLzAwMDExMTIyMjMzMzQ0NDU1NTY2Njc3Nzg4ODk5OTo6Ojs7Ozw8PEhEP1RMQ2BTRmpaSXRgTH1mT4ZsUY5xU559WayHXbePYcSYZNCfZ9uoa+Osbeevbuuxbu6zb/Gzb/K0cPO0cPK1cfC1cuy2c+a2dN23dtO5eMi6e767fbS8f7C8f628gKu8gKu8gKu8gKu8gKu8gKu8gKu9gau9gau9gau9gau9gau9gau9gau9gay+g62/ha7AhrDBiLHBirLCi7PDjLPDjrTEjrXEj7bEj7fFkLrGkr7HlcLJmMbKm8rMnc/NoNTPpNvSqN/TrOHUreLVr+TWsejXtOnZt+rbu+vcvujewubgxurgyO7hyu/izfDiz/Lj0vTl1vXn3P3w7P3w7f3x7v3y7/7z8P708v729P749/75+P7+/v7+/v7+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wi4ADkJHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXcr0ISI6Y8bQQZQUUdSrY6jmJBQlCiGFULFKXfnoUcOuXRWKvUrWLEO0UdSuHaOTq1ewa+kgtSpW69GnUac2HUy4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoFMGBAAh+QQJAwCdACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBMSENYT0ZjVklyY0+AblSTe1mihV6xkGK8mGXFn2jLpWrQq23Srm/PsnLKtHXFt3fBuHm8uXu3un2xu3+svICrvICrvICrvICrvICrvICrvICrvYGrvYGrvYGrvYGrvYGrvYGrvYGsvYKtvoOtvoSvwIexwouzw461xZC2xpK4x5W5yJe7ypm8ypvAzJ7H0KXP06vW1rHe2bbi2rjm27rq3Lvt3Lzv3L3x3b3v3b7t3b/n3sDi38Ld38Lb38Pa4MPa4MXb4cbd4sjg5Mzk5tHp6dft7N7w7+P08ej38+369fH89vP99vT+9/X+9/X++Pb++Pb++ff++ff++ff++vj++vj++vn+/Pr+/v7+/v7+/v7//v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IwwA7CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KFKIgQIAELWXDpSoXNjsl5ckjSaEgq1YJbWzUyKEjRw3zNGmSRyEgsFUBjS3b8GzatW0TvoUrN6dWrl7hcpGKlKpVrEqfAhLbtLHjx5AjS55MubLly5gza97MubPnz6BDix5NurTp06hTq04ZEAAh+QQJAwCeACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dISEhJSUlKSkpLS0tMTExNTU1OTk5PT09QUFBbV1NmXlV0alqCdF+NfWKYhWWnj2mzlmu+nm7HpHDOqHLTrHPYr3TZsXXWtHbQtnjLt3rFuXu+un24u36yvH+tvICsvICsvICsvICrvICrvYGrvYGrvYGsvYGtvYKuvoOvv4Wywoq1xI+3xpK5yJa7yZm8ypu+y53Ay5/Dy6HFy6TIy6bLy6nPy6zTy7DXzLPczLjfzLvjzL7mzMHozcPqzsbq0sns1s7v29Tw39nx4drx5d7x6OHx6uLx7OTx7uXx8Ofx8un09u72+PH2+PL7/Pn9/fz+/v3+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IpgA9CRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtKlESXbWrMkjSWlUqVM5GjLk0YsXhlixauXa0SvYsGuU5gmbR6mktVOrOp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5D7BgQAIfkECQMApAAsAAAAAFAAUACHAAAAAQEBAgICAwMDBAQEBQUFBgYGBwcHCAgICQkJCgoKCwsLDAwMDQ0NDg4ODw8PEBAQEREREhISExMTFBQUFRUVFhYWFxcXGBgYGRkZGhoaGxsbHBwcHR0dHh4eHx8fICAgISEhIiIiIyMjJCQkJSUlJiYmJycnKCgoKSkpKioqKysrLCwsLS0tLi4uLy8vMDAwMTExMjIyMzMzNDQ0NTU1NjY2Nzc3ODg4OTk5Ojo6Ozs7PDw8PT09Pj4+Pz8/QEBAQUFBQkJCQ0NDRERERUVFRkZGR0dHSEhISUlJSkpKS0tLTExMTU1NTk5OT09PUFBQWVJSYlRVa1VXcldZeVhbf1pchVteiVxfjV1glGFjnmVlpWhnsG1qt3BsvHJtvHhvvH1wuYRyt411tJZ3s5x4sqN6sKp8r7B9rbR/rLh/q7qAqryAqryAqryBq7yBq72Bq72BrL2Crb6Dr76FsL+GtcOMusaTv8mYxM2gytCnztOs0dax19m32tu729y93t2/4t7B5uDD6eHF6+LH6+PJ7OTL7ebP7ufS8OrW8uzb8+/g9PLl9vTp9vTr9fXs9fXt9fbt9fbu9fbu9ffv9vfw9vjx9vjx9vjy9/jy9/nz+Pn0+fr1+fr2+/z6/f38/f79/v7+/v7+/v7+////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CKcASQkcSLCgwYMIEypcyLChw4cQI0qcSLGixYsYM2rcyLGjx48gQ4ocSbKkyZMoU6pcybKly5cwY8qcSbOmzZs4c+rcybOnz59AgwodSrSo0aNIkypdyrTpREp//lBaSgmOVThTN3754tGQIYZ/rsL5w3Fr168Lw14lm7Tq1axto8J1Sreu3bt48+rdy7ev37+AAwseTLiw4cOIEytezLix48eQI/cNCAAh+QQJAwCyACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NNRUVXR0hgSUtoS01vTE92TlF8T1KBUFSFUVWSV1mbW1umXl6yY2G0Z2S3a2a2cWi0d2uzfW2whHCxiHGxjXOwknWvmXiwoXywqX+vr4Kvt4auvYmwv4uxwI2zwY61w5C2xJK3xZS4xpW5x5a5x5a6x5e6x5e7x5i8x5m+xprAxZvDxJ3Hw6DOwaTWv6nevK/ku7LpubXsuLfuuLnwt7rxt7rxt7rxt7vxt7vyt7vyt7vyt7vyt7vyuLzyuLzyub3yur7yu7/zvcHzv8L0xcn219j23dz24eD25uT66+v87u/99fX+/v7+/v7//v3//v3//fz//Pv//Pr/+/r/+/n++vj++ff++ff++Pb+9/b+9/X+9/X+9/X+9/X++Pb++Pb++fb++ff++ff++/n//Pv//Pv//fz//f3//v7//v7//v7//v7//v7//v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IrgBlCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtOnMR336PGLJKE0aRhz7SJHSp6EnTw5JkWqY5suXNFm3dmX4NexYhmXPcoQqlapVrE7z6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS55MubLlyz0DAgAh+QQJAwCZACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxscHBwdHR0eHh4fHx8gICAhISEiIiIjIyMkJCQlJSUmJiYnJycoKCgpKSkqKiorKyssLCwtLS0uLi4vLy8wMDAxMTEyMjIzMzM0NDQ1NTU2NjY3Nzc4ODg5OTk6Ojo7Ozs8PDw9PT0+Pj4/Pz9AQEBBQUFCQkJDQ0NERERFRUVGRkZHR0dRSUpcTE1lTlBvUFN4U1WAVFiIVlqQWFycWl+mXGGyXmS8X2bEYWfKYmnQYmnVYmnYYmrbYmrcYWneYWnfYGjgX2jgX2jgX2jhYGnhYWnhYWrhYWrhYmvhY2vgZGvgZGzgZmzfZ23eaW3dbG7bb3DZdHHWenTSg3fMkHzGnYDDpIO/q4W9som/to7CuJLEuZXMuZvTu6PZvKrev7DfwrPex7bezbvc18He3Mbe38nf4szf5c7g5c7g5c/h5dDk5tLm5tTo59br59jt6Nrw6dzz6d/16uD36uL47OX67uj68Ov68+779fH89/X9+vn+/Pv+/f3///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IqAAzCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KtOnMPWfO7GFpqVAhSxzPdOlypuGjRx0H0aEzKOvWrgy/hh1bdiNUqVQHtXVKt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5AjS+4ZEAAh+QQJAwBgACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQhGRk5IiNPKSxiMDR6OT2NP0WdRUuuSlG6TlbEUVnMVFzSVl7XWGDaWWHcWWLeWmPfWmPfWmPgWmPgWmPgWmPgW2TgW2TgXGTgXWXfX2bfYWfeZGndaWzbbm/adHLWgHjVjYDVmIfUoo3TqpLUsJjYsJzdsKDgsaLkr6Tnrqbrq6jsrKjtrqrutK3vuK/xvLHxwLTyw7jyxbzzx8DzycTzy8j10M720tH21NT31db31df31df42tz42tz429354eL65uf76On99/f++vr+/Pz+/v7+/v7+/v7+/v7+/v7+/v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IpwDBCBxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl3KFOaTHz+eLH2ioqoKqUl/WFXxgyERIh5z5OCo1WrXhV/Djt1I1SrWpE+jNp1Lt67du3jz6t3Lt6/fv4ADCx5MuLDhw4gTK17MuLHjx5Aj+wwIACH5BAkDAGcALAAAAABQAFAAhwAAAAEBAQICAgMDAwQEBAUFBQYGBgcHBwgICAkJCQoKCgsLCwwMDA0NDQ4ODg8PDxAQEB4VFisaHDcfIUMkJk0oKnY2O5lCSLBKUcZSWdNWX9pZYd5aYt9aY+BaY+BaY+BaY+BaY+BbZOBbZOFbZOFcZeFcZeFeZ+FfaOFfaOJhaeJiaeNjaeNkaeRmaeZoaOhrZ+luZ+pvZutyZe12Z+56ae58bO+Bce+Gd/CLffGQg/GWivGckvKkm/Ktp/O0r/S+uvXHxfbQz/bY2fbb2/fd3ffd3ffe3ffe3vff3vff3/fg3/bh3/Xi3/Tk4PTm4fPo4vLq4vPq4/Tr5fXs5fbs5/fs6Pns6fvu6/vu6/zu7Pzv7P308/739/76+v77+/78/P79/f7+/v7+/v7+/v7+/v/+/v///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wi4AM8IHEiwoMGDCBMqXMiwocOHECNKnEixosWLGDNq3Mixo8ePIEOKHEmypMmTKFOqXMmypcuXMGPKnEmzps2bOHPq3Mmzp8+fQIMKHUq0qNGjSJMqXdpyyRKmQ1qQINFiiFKpU6ky3LJl55KsWa8o3FKjRleOUaJs/AqWhNiEZM12TMsR69QWW8/qjHrX6tIrb5kKHky4sOHDiBMrXsy4sePHkCNLnky5suXLmDNr3sy5s+fPoBsGBAAh+QQJAwCAACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhoyIiNIKixbMDNsNjqBPUKYREqpSlC7T1fHU1vRVl7XWGDbWWLeWmPfWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgW2TgW2ThW2ThW2ThXGThXGXhXWbhXmfhYGjhYGnhYWniY2rlZ2nmamjobWfpb2fqcWfsc2fteGrte23tfXDtf3TtgnrshH7shoLsiIXsionsjY3sj5DskJHtk5Ptl5fvnJrwoZ7ypqHzqqP0r6j0s670tbH0t7X0ubj0vb30wcH1xcX3zs341tP529j64Nz75OD75+P86eX86+f87en87+v88O398u/99PH89PP89fP89fT89vX89/X8+PX8+fb8+fb8+ff8+vf8+vf8+vf8+/j8/fv+/v7+/v7+/v7+/v7+/v7+/v7+/v7+/v7//v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IyQABCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKl26cg2WJk2wrEm6ZoeMqzJ2TD2KBStWLArDTJkSRmcTr1ebKJwiRAiVhm/eOJQjZ+NZtGoTsnULV25Duhu7ogWbUOyUMjqretVK9WnUrUwjS55MubLly5gza97MubPnz6BDix5NurTp06hTq17NurXr1wsDAgAh+QQJAwCNACwAAAAAUABQAIcAAAABAQECAgIDAwMEBAQFBQUGBgYHBwcICAgJCQkKCgoLCwsMDAwNDQ0ODg4PDw8QEBARERESEhITExMUFBQVFRUWFhYXFxcYGBgZGRkaGhobGxsoHyA+JylTLjF0OT2XREqvTFLEUlrRVl7YWGHdWWLfWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgWmPgW2TgW2TgW2TgW2TgW2TgW2ThW2ThW2ThW2ThW2ThXGXhXWbhXWbhXmfhX2jhYGnhYWrhYWrhYmviY2rjZGrkZmrmaWnobGfpb2brcmXtdGTveGPxfGTyfmXygGfyg2vziHH0jnj0loH1non2pJH3q5r3r573saH3s6P4tqb3vLD3w7z3yMP3ysf3zcr3z8v408/52NP529b63tr64tz75d/75+L76OT86ef86un86un87O387e787u/87u/87+/98PD98fH98fH98vL98/L+9PP+9PP+9fT+9vX+9/X/9/X/9/X/9/X/9/X/9/X/9/X/9/X/9/b/+fj/+vn//v7//v7//v7//v7//v7//v7//v7//v7//v7//v7///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8IzgAbCRxIsKDBgwgTKlzIsKHDhxAjSpxIsaLFixgzatzIsaPHjyBDihxJsqTJkyhTqlzJsqXLlzBjypxJs6bNmzhz6tzJs6fPn0CDCh1KtKjRo0iTKkWJBs3SRl2G1KgxpEvSLlOz1rCqME+enUG0Th2ikMqSJVhyohGb1enBPGfPfl1IhozKtWxruDUIN+5chXVXhhUbRCGWs2lzYhXLNaFXnl0GB2mctOnTy5gza97MubPnz6BDix5NurTp06hTq17NurXr17Bjy55NW2VAADsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
                },
                data: 'ajax=1&action=ktg_save_content&url='+encodeURIComponent(lstURI[curURI])
                        +'&manga_id='+idmanga+'&host='+host+'&post_type='+ptype+'&category='+cate,
                success: function(data) {
                    switch(data.error){
                        case -1:
                            curURI++;
                            jQuery('#wrong').append(data.msg+'<br />');
                            break;
                        case 1:
                        case 2:
                            curURI++;
                            jQuery('#gagal').append(data.msg+'<br />');
                            failed++;
                            gagalUp();
                            TotalUp();
                            break;
                        case 0:
                            curURI++;
                            jQuery('#sukses').append(data.msg+'<br />');
                            suksesUp();
                            TotalUp();
                            break;
						default:
                            curURI++;
                            jQuery('#gagal').append(lstURI[curURI]+' - Unreachable Host retry again later<br />');
                            failed++;
                            gagalUp();
                            TotalUp();
							break;
                    }
                    Gthread(lstURI, curURI, gImg, maxFail, failed, idmanga,host,ptype,cate,delay);
                },
				error: function (jqXHR, exception) {
                            curURI++;
                            jQuery('#gagal').append(lstURI[curURI]+' - '+getErrorMessage(jqXHR, exception)+'<br />');
                            failed++;
                            gagalUp();
                            TotalUp();
                    Gthread(lstURI, curURI, gImg, maxFail, failed, idmanga,host,ptype,cate,delay);
				}
            });
            return true;
        }
		function getErrorMessage(jqXHR, exception) {
			var msg = '';
			if (jqXHR.status === 0) {
				msg = 'Not connect.\n Verify Network.';
			} else if (jqXHR.status == 404) {
				msg = 'Requested page not found. [404]';
			} else if (jqXHR.status == 500) {
				msg = 'Internal Server Error [500].';
			} else if (exception === 'parsererror') {
				msg = 'Requested JSON parse failed.';
			} else if (exception === 'timeout') {
				msg = 'Time out error.';
			} else if (exception === 'abort') {
				msg = 'Ajax request aborted.';
			} else {
				msg = 'Uncaught Error.\n' + jqXHR.responseText;
			}
			return msg;
		}
        function filterURI(a) {
    var data = a['split']("\n");
    var filtered = new Array();
    var listURL = new Array();
    for (var i = 0; i < data['length']; i++) {
        if (data[i]['length'] > 0) {
            var expression = /^(http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}([0-9A-Za-z-\.@:%_\+~#=]+)+((\.[a-zA-Z]{2,3})+)(\/(.)*)?(\?(.)*)?/g;
            var regex = data[i]['match'](new RegExp(expression));
            if (null == regex) {
                continue;
            };
            if (filtered['indexOf'](regex[0]) == -1) {
                filtered['push'](regex[0]);
                listURL['push'](data[i]);
            };
        };
    };
    return listURL;
};
		$(document).ready(function(){
 $('.kg-search').kgsearch({no_results_text: "Oops, nothing found!"}); 

if($('#host_id')){
$('#ktg_tools').addClass('loading');
			jQuery.ajax({
				type:"GET",
				timeout: 15000,
				url:'https://app.kinggrabber.com/api/v1/list',
				success:function(res) {
					if(res.status=='success') {
var temp = res.data;
var $select = $('#host_id'); 
$select.find('option').remove();  
$select.append('<option disabled selected value="">Select Host</option>');
$.each(temp,function(key, value) 
{
	var status  = value.status == false ? 'disabled':'';
    $select.append('<option id="'+value.path+'" data-'+value.path+'="'+value.website+'" value="' + value.path + '" '+status+'>' + value.name + '</option>');
});
$('#ktg_tools').removeClass('loading');
					}else{
						errMsg(res.status+' - '+res.message)
					}
				},
				error: function(request, status, err) {
					errMsg("You can't use our Tools right now please check our news");
					$('#ktg_tools').removeClass('loading');
					var $select = $('#host_id'); 
					$select.find('option').remove();  
					$select.append('<option disabled selected value="">Host Offline</option>');
				}
			});
}
$("#ktg_message").on("click", "button.notice-dismiss", function(){
					jQuery("#ktg_message").html('');					
});
$('#api_key').change(function() {
						jQuery("#api_key").css("border-color","#fff");
});
$('#ktg_save').click(function() {
	var status = jQuery("#status_key").val();
	if(status == 1){
        $('#ktg_sub').submit();
	}else{
		errMsg('You must check your key before saving !!');
		return false;
	}
    });
$('#host_id').change(function() {
	var val = $(this).val();
     $('#series_url').attr("placeholder", $('#'+val).data(val)+'example-series-link');
     $('#ktg_source').attr("placeholder", $('#'+val).data(val)+'example-chapter-link');
});
            jQuery('#submit_kg').click(function(){
                if( !jQuery('#manga_id').val() ) { 
                    alert('Local Comic is Required');
                    return false;
                }
                if( jQuery('#kg_cat').val() == 1 && !jQuery('#kg_category').val() ) { 
                    alert('Categories Comic is Required');
                    return false;
                }
			var host = $('#host_id').find(":selected").val();
			var type = $('#post_type').find(":selected").val();
			var cate = $('#kg_category').find(":selected").val();
			var idmanga = jQuery("#manga_id").val();
                var uritext = filterURI(jQuery('textarea#list_multi').val());
                var gImg = jQuery('#gImg').is(':checked') ? 1 : 0;
                var maxFail = parseInt(jQuery('#fail').val());
                var delay = parseInt(jQuery('#delay').val());
                var failed = 0;
                if(jQuery('textarea#list_multi').val().trim()=='' || uritext.length == 0){
                    alert('URI / Series cant be empty');
                    return false;
                }
                jQuery('#total_count').html(0);
                jQuery('#gagal_count').html(0);
                jQuery('#sukses_count').html(0);
                jQuery('#sukses').html('');
                jQuery('#gagal').html('');
                jQuery('textarea#list_multi').val(uritext.join("\n")).attr('disabled', true);
                jQuery('#result').show();
                jQuery('#submit_kg').attr('disabled', true);
                jQuery('#stop').attr('disabled', false);
                Gthread(uritext,  0, gImg, maxFail, 0, idmanga,host,type,cate,delay);
                return false; 
            });
            jQuery('#stop').click(function(){
            	Hentikan(false);
            });
});