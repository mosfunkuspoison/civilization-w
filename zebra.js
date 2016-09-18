function zebraStart(_EUI) {
	// function createTextFieldPan() {
    //     var p = new Panel(new GridLayout(3, 2));
	//
    //     var ctr = new Constraints();
    //     ctr.ay = CENTER;
    //     ctr.setPadding(2);
	//
	// 	var tf = new TextField();
    //     tf.setPreferredSize(120, -1);
    //     tf.setHint("<enter text>");
    //     p.add(ctr, new BoldLabel("Text field:"));
    //     p.add(ctr, tf);
	//
    //     tf = new TextField(new zebra.data.SingleLineTxt("dsd", 5));
    //     tf.setPreferredSize(120, -1);
    //     p.add(ctr, new BoldLabel("Fixed size(5):"));
    //     p.add(ctr, tf);
    //     tf = new TextField(new PasswordText());
    //     tf.setPreferredSize(120, -1);
    //     p.add(ctr, new BoldLabel("Password field:"));
    //     p.add(ctr, tf);
    //     return p; //createBorderPan("Text fields", p);
    // }

    // function createButtonPan() {
    //     var p = new Panel(new FlowLayout(CENTER, CENTER, HORIZONTAL, 8));
    //     p.add(new Button("Button"));
    //     var bt = new Button("was butterfly");
    //     bt.setFocusMarkerView(null);
    //     p.add(bt);
    //     p.add(new Button("was butterfly"));
    //     bt = new Button("Disabled button");
    //     bt.setEnabled(false);
    //     p.add(bt);
    //     p.add(new Link("Link"));
    //     var bp = createBorderPan("Buttons", p);
    //     bp.setPadding(8);
    //     return bp;
    // }

    // function createCheckboxPan(n) {
    //     var p = new Panel(new FlowLayout(CENTER, CENTER, VERTICAL, 4)),
    //         s = "Checkbox button ";
    //     for(var i=0; i < n;  i++) {
    //         var ch = new Checkbox(s + (i+1));
    //         p.add(ch);
	// 		ch.setEnabled(true);
	//         ch.setValue(false);
	// 		ch.manager.bind(function(sm) {
	// 			var s = sm.getValue();
	// 		});
	// 	}
    //     return createBorderPan(s, p);
    // }
    //
	// function createRadioPan(n) {
    //     var p = new Panel(new FlowLayout(CENTER, CENTER, VERTICAL, 4)),
    //         s = "Radio button ", g = new Group();
    //     for(var i=0; i < n;  i++) {
    //         var ch = new Radiobox(s + (i+1));
    //         p.add(ch);
    //         if (g != null) ch.setSwitchManager(g);
    //     }
    //     ch.setEnabled(false);
    //     ch.setValue(true);
    //     return createBorderPan(s, p);
    // }
    //
    // function createComboPan() {
    //     var p = new Panel(new ListLayout(8));
    //     var cb = new Combo(["Item 1", "Item 2", "Item 3"]);
    //     cb.list.select(0);
    //     p.add(cb);
    //     var cb2 = new Combo(true);
    //     cb2.list.model.add("Item 1");
    //     cb2.list.model.add("Item 2");
    //     cb2.list.model.add("Item 3");
    //     var ps= cb2.getPreferredSize();
    //     cb2.setPreferredSize(ps.width, -1);
    //     p.add(cb2);
    //     var l = new CompList(true);
    //     l.setBorder(null);
    //     l.add(new CompList.ImageLabel("Item 1", null));
    //     l.add(new CompList.ImageLabel("Item 2", null));
    //     l.add(new CompList.ImageLabel("Item 3", null));
    //     var cb3 = new Combo(l);
    //     cb3.list.select(0);
    //     p.add(cb3);
    //     var bp = createBorderPan("Drop down list", p);
    //     bp.setGaps(4,8);
    //     return bp;
    // }
    //
    // function createBorderPan(content, txt, w, h) {
	// 	txt = txt || "";
	// 	content = content || new Panel();
	// 	w = w || -1;
	// 	h = h || -1;
	// 	var bp = new BorderPan(txt, content);
	// 	content.setPadding(4);
	// 	bp.setLayout(new ListLayout());
    //
	// 	bp.setPreferredSize(w, h);
	// 	return bp;
	// }
    ////////////////////////////

	function createLabel(txt, color, font) {
        font = font || zebra.ui.boldFont;
		color = color || zebra.ui.palette.black;
		var l = new Label(txt.indexOf("\n") >= 0 ? new zebra.data.Text(txt) : txt);
		l.setColor(color);
		l.setFont(font);
		l.setPadding(1);
		return l;
	}

	function createButton(txt) {
		txt = txt || "";
		var bt = new Button(createLabel(txt));
		bt.setFocusMarkerView(null);
		return bt;
	}

	function createMTextArea(txt,w,h) {
		txt = txt || "";
		w = w || -1;
		h = h || -1;
		var p = new Panel(new ListLayout());
		var tf = new TextArea(txt);
		tf.setBlinking();
		tf.setPreferredSize(w, h);
		p.add(LEFT, tf);
		return p;
	}

	function createLabelledTextField(lbl, txt, w) {
		lbl = lbl || "";
		txt = txt || "";
		w = w || -1;
		var p = new Panel(new GridLayout(1, 2));
		var ctr = new Constraints();
		ctr.ay = CENTER;
		ctr.setPadding(2);
        var l = new BoldLabel(lbl)
        l.setPreferredSize(Math.floor(w/2), -1)
        l.setColor(zebra.ui.palette.black);
		var tf = new TextField();
		tf.setPreferredSize(Math.floor(w/2), -1);
		tf.setValue(txt);

		//tf.setHint("<enter text>");
		p.add(ctr, l);
		p.add(ctr, tf);
		return p;
	}



//     // scroll vertically and horizontally a large picture
// var scrollPan = new zebra.ui.ScrollPan(new zebra.ui.ImagePan("largePicture.jpg"));
//
// // scroll vertically  a large picture
// var scrollPan = new zebra.ui.ScrollPan(new zebra.ui.ImagePan("largePicture.jpg"),
//                                        zebra.layout.VERTICAL);
//
// // scroll horizontally a large picture
// var scrollPan = new zebra.ui.ScrollPan(new zebra.ui.ImagePan("largePicture.jpg"),
//                                        zebra.layout.HORIZONTAL);


////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Panel
	function createGamevarsPanel() {
		var p = new Panel(new ListLayout(LEFT,2));
		p.setPadding(2);

		// Loop through external UI objects
		Object.keys(_EUI).forEach(function(k) {
			// functions for sanity
			function eui(j)            { return _EUI[k][j]; }
			function euiSet(j, assign) { _EUI[k][j] = assign; }

			switch (eui("type")) {
				case "checkbox":
					euiSet("obj", new Checkbox(eui("label")));
					eui("obj").setEnabled(eui("active"));
					eui("obj").setValue(eui("v"));
					eui("obj").manager.bind(function(sm) {
						euiSet("v", sm.getValue())
					});
				break;
				case "label":
					euiSet("obj", createLabel(eui("v")));
				break;
				case "button":
					euiSet("obj", createButton(eui("v")));

				break;
				case "textfield":
					euiSet("obj", createLabelledTextField(eui("label"), eui("v"), 230));

				break;
				case "multitext":
					euiSet("obj", createMTextArea(eui("v"), 230,300));
				break;
				default: console.log("*** zebra: bad UI type");
			}
			p.add(eui("obj"));
		});
		return p;
	}

	eval(zebra.Import("ui", "layout"));

	zebra.ready( function() {
		var _canvas = new zebra.ui.zCanvas("zCanvas",250,780);
		var root = _canvas.root;
		var tabs = new zebra.ui.Tabs();

		root.properties({
			padding: 2,
			border : new zebra.ui.Border(),
			layout : new zebra.layout.BorderLayout(),
			kids   : {
				CENTER: tabs.properties({
					kids : {
						"Gamevars1"     : createGamevarsPanel(),
						"etc"          :  new zebra.ui.TextArea("assadsdfsdasd"),
						"etc2"         : new zebra.ui.TextArea("werfsfgwer"),
						"etc3"    	   : new zebra.ui.TextArea("twertrdf")
					}
				})
			}
		});

		_canvas.$context.save();
		root.repaint();
	}); // end zebra ready
}
