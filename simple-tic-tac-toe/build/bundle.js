
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Square.svelte generated by Svelte v3.24.0 */

    const file = "src/Square.svelte";

    function create_fragment(ctx) {
    	let div;
    	let div_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");

    			attr_dev(div, "class", div_class_value = "" + (null_to_empty(/*image*/ ctx[0] === "plane"
    			? "plane-url"
    			: /*image*/ ctx[0] === "firetruck" ? "firetruck-url" : "") + " svelte-q2m2oh"));

    			add_location(div, file, 32, 0, 758);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "click", /*click_handler*/ ctx[3], false, false, false),
    					listen_dev(div, "mouseover", /*mouseDown*/ ctx[1], false, false, false),
    					listen_dev(div, "mouseout", /*mouseUp*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*image*/ 1 && div_class_value !== (div_class_value = "" + (null_to_empty(/*image*/ ctx[0] === "plane"
    			? "plane-url"
    			: /*image*/ ctx[0] === "firetruck" ? "firetruck-url" : "") + " svelte-q2m2oh"))) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { image = "" } = $$props;

    	const mouseDown = evt => {
    		evt.target.style.backgroundColor = "#f6f6f6";
    	};

    	const mouseUp = evt => {
    		evt.target.style.backgroundColor = "#fff";
    	};

    	const writable_props = ["image"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Square> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Square", $$slots, []);

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    	};

    	$$self.$capture_state = () => ({ image, mouseDown, mouseUp });

    	$$self.$inject_state = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [image, mouseDown, mouseUp, click_handler];
    }

    class Square extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { image: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Square",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get image() {
    		throw new Error("<Square>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<Square>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$1 = "src/App.svelte";

    function create_fragment$1(ctx) {
    	let h1;
    	let t0;
    	let span;
    	let t2;
    	let p;
    	let t4;
    	let ol;
    	let li0;
    	let t6;
    	let li1;
    	let t7;
    	let br;
    	let t8;
    	let t9;
    	let li2;
    	let t11;
    	let table;
    	let tbody;
    	let tr0;
    	let td0;
    	let square0;
    	let t12;
    	let td1;
    	let square1;
    	let t13;
    	let td2;
    	let square2;
    	let t14;
    	let tr1;
    	let td3;
    	let square3;
    	let t15;
    	let td4;
    	let square4;
    	let t16;
    	let td5;
    	let square5;
    	let t17;
    	let tr2;
    	let td6;
    	let square6;
    	let t18;
    	let td7;
    	let square7;
    	let t19;
    	let td8;
    	let square8;
    	let t20;
    	let button;
    	let current;
    	let mounted;
    	let dispose;

    	square0 = new Square({
    			props: { image: /*show*/ ctx[0][0] },
    			$$inline: true
    		});

    	square0.$on("click", /*click_handler*/ ctx[3]);

    	square1 = new Square({
    			props: { image: /*show*/ ctx[0][1] },
    			$$inline: true
    		});

    	square1.$on("click", /*click_handler_1*/ ctx[4]);

    	square2 = new Square({
    			props: { image: /*show*/ ctx[0][2] },
    			$$inline: true
    		});

    	square2.$on("click", /*click_handler_2*/ ctx[5]);

    	square3 = new Square({
    			props: { image: /*show*/ ctx[0][3] },
    			$$inline: true
    		});

    	square3.$on("click", /*click_handler_3*/ ctx[6]);

    	square4 = new Square({
    			props: { image: /*show*/ ctx[0][4] },
    			$$inline: true
    		});

    	square4.$on("click", /*click_handler_4*/ ctx[7]);

    	square5 = new Square({
    			props: { image: /*show*/ ctx[0][5] },
    			$$inline: true
    		});

    	square5.$on("click", /*click_handler_5*/ ctx[8]);

    	square6 = new Square({
    			props: { image: /*show*/ ctx[0][6] },
    			$$inline: true
    		});

    	square6.$on("click", /*click_handler_6*/ ctx[9]);

    	square7 = new Square({
    			props: { image: /*show*/ ctx[0][7] },
    			$$inline: true
    		});

    	square7.$on("click", /*click_handler_7*/ ctx[10]);

    	square8 = new Square({
    			props: { image: /*show*/ ctx[0][8] },
    			$$inline: true
    		});

    	square8.$on("click", /*click_handler_8*/ ctx[11]);

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t0 = text("Simple ");
    			span = element("span");
    			span.textContent = "Tic Tac Toe";
    			t2 = space();
    			p = element("p");
    			p.textContent = "There is no AI so you need to:";
    			t4 = space();
    			ol = element("ol");
    			li0 = element("li");
    			li0.textContent = "Choose who is going to be the plane and who is going to be the firetruck";
    			t6 = space();
    			li1 = element("li");
    			t7 = text("Decide when the game is finished");
    			br = element("br");
    			t8 = text(" - a win or tie");
    			t9 = space();
    			li2 = element("li");
    			li2.textContent = "Keep score";
    			t11 = space();
    			table = element("table");
    			tbody = element("tbody");
    			tr0 = element("tr");
    			td0 = element("td");
    			create_component(square0.$$.fragment);
    			t12 = space();
    			td1 = element("td");
    			create_component(square1.$$.fragment);
    			t13 = space();
    			td2 = element("td");
    			create_component(square2.$$.fragment);
    			t14 = space();
    			tr1 = element("tr");
    			td3 = element("td");
    			create_component(square3.$$.fragment);
    			t15 = space();
    			td4 = element("td");
    			create_component(square4.$$.fragment);
    			t16 = space();
    			td5 = element("td");
    			create_component(square5.$$.fragment);
    			t17 = space();
    			tr2 = element("tr");
    			td6 = element("td");
    			create_component(square6.$$.fragment);
    			t18 = space();
    			td7 = element("td");
    			create_component(square7.$$.fragment);
    			t19 = space();
    			td8 = element("td");
    			create_component(square8.$$.fragment);
    			t20 = space();
    			button = element("button");
    			button.textContent = "New Game";
    			attr_dev(span, "class", "title svelte-3q46tm");
    			add_location(span, file$1, 21, 8, 351);
    			attr_dev(h1, "class", "svelte-3q46tm");
    			add_location(h1, file$1, 20, 0, 338);
    			attr_dev(p, "class", "svelte-3q46tm");
    			add_location(p, file$1, 23, 0, 396);
    			attr_dev(li0, "class", "svelte-3q46tm");
    			add_location(li0, file$1, 27, 1, 443);
    			add_location(br, file$1, 28, 37, 562);
    			attr_dev(li1, "class", "svelte-3q46tm");
    			add_location(li1, file$1, 28, 1, 526);
    			attr_dev(li2, "class", "svelte-3q46tm");
    			add_location(li2, file$1, 29, 1, 590);
    			attr_dev(ol, "class", "svelte-3q46tm");
    			add_location(ol, file$1, 26, 0, 437);
    			attr_dev(td0, "class", "svelte-3q46tm");
    			add_location(td0, file$1, 34, 6, 640);
    			attr_dev(td1, "class", "svelte-3q46tm");
    			add_location(td1, file$1, 35, 3, 715);
    			attr_dev(td2, "class", "svelte-3q46tm");
    			add_location(td2, file$1, 36, 3, 789);
    			add_location(tr0, file$1, 34, 2, 636);
    			attr_dev(td3, "class", "svelte-3q46tm");
    			add_location(td3, file$1, 38, 6, 874);
    			attr_dev(td4, "class", "svelte-3q46tm");
    			add_location(td4, file$1, 39, 3, 948);
    			attr_dev(td5, "class", "svelte-3q46tm");
    			add_location(td5, file$1, 40, 3, 1022);
    			add_location(tr1, file$1, 38, 2, 870);
    			attr_dev(td6, "class", "svelte-3q46tm");
    			add_location(td6, file$1, 42, 6, 1107);
    			attr_dev(td7, "class", "svelte-3q46tm");
    			add_location(td7, file$1, 43, 3, 1181);
    			attr_dev(td8, "class", "svelte-3q46tm");
    			add_location(td8, file$1, 44, 3, 1255);
    			add_location(tr2, file$1, 42, 2, 1103);
    			add_location(tbody, file$1, 33, 1, 626);
    			attr_dev(table, "class", "svelte-3q46tm");
    			add_location(table, file$1, 32, 0, 617);
    			attr_dev(button, "class", "svelte-3q46tm");
    			add_location(button, file$1, 48, 0, 1355);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t0);
    			append_dev(h1, span);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, p, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, ol, anchor);
    			append_dev(ol, li0);
    			append_dev(ol, t6);
    			append_dev(ol, li1);
    			append_dev(li1, t7);
    			append_dev(li1, br);
    			append_dev(li1, t8);
    			append_dev(ol, t9);
    			append_dev(ol, li2);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, tbody);
    			append_dev(tbody, tr0);
    			append_dev(tr0, td0);
    			mount_component(square0, td0, null);
    			append_dev(tr0, t12);
    			append_dev(tr0, td1);
    			mount_component(square1, td1, null);
    			append_dev(tr0, t13);
    			append_dev(tr0, td2);
    			mount_component(square2, td2, null);
    			append_dev(tbody, t14);
    			append_dev(tbody, tr1);
    			append_dev(tr1, td3);
    			mount_component(square3, td3, null);
    			append_dev(tr1, t15);
    			append_dev(tr1, td4);
    			mount_component(square4, td4, null);
    			append_dev(tr1, t16);
    			append_dev(tr1, td5);
    			mount_component(square5, td5, null);
    			append_dev(tbody, t17);
    			append_dev(tbody, tr2);
    			append_dev(tr2, td6);
    			mount_component(square6, td6, null);
    			append_dev(tr2, t18);
    			append_dev(tr2, td7);
    			mount_component(square7, td7, null);
    			append_dev(tr2, t19);
    			append_dev(tr2, td8);
    			mount_component(square8, td8, null);
    			insert_dev(target, t20, anchor);
    			insert_dev(target, button, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*refresh*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const square0_changes = {};
    			if (dirty & /*show*/ 1) square0_changes.image = /*show*/ ctx[0][0];
    			square0.$set(square0_changes);
    			const square1_changes = {};
    			if (dirty & /*show*/ 1) square1_changes.image = /*show*/ ctx[0][1];
    			square1.$set(square1_changes);
    			const square2_changes = {};
    			if (dirty & /*show*/ 1) square2_changes.image = /*show*/ ctx[0][2];
    			square2.$set(square2_changes);
    			const square3_changes = {};
    			if (dirty & /*show*/ 1) square3_changes.image = /*show*/ ctx[0][3];
    			square3.$set(square3_changes);
    			const square4_changes = {};
    			if (dirty & /*show*/ 1) square4_changes.image = /*show*/ ctx[0][4];
    			square4.$set(square4_changes);
    			const square5_changes = {};
    			if (dirty & /*show*/ 1) square5_changes.image = /*show*/ ctx[0][5];
    			square5.$set(square5_changes);
    			const square6_changes = {};
    			if (dirty & /*show*/ 1) square6_changes.image = /*show*/ ctx[0][6];
    			square6.$set(square6_changes);
    			const square7_changes = {};
    			if (dirty & /*show*/ 1) square7_changes.image = /*show*/ ctx[0][7];
    			square7.$set(square7_changes);
    			const square8_changes = {};
    			if (dirty & /*show*/ 1) square8_changes.image = /*show*/ ctx[0][8];
    			square8.$set(square8_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(square0.$$.fragment, local);
    			transition_in(square1.$$.fragment, local);
    			transition_in(square2.$$.fragment, local);
    			transition_in(square3.$$.fragment, local);
    			transition_in(square4.$$.fragment, local);
    			transition_in(square5.$$.fragment, local);
    			transition_in(square6.$$.fragment, local);
    			transition_in(square7.$$.fragment, local);
    			transition_in(square8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(square0.$$.fragment, local);
    			transition_out(square1.$$.fragment, local);
    			transition_out(square2.$$.fragment, local);
    			transition_out(square3.$$.fragment, local);
    			transition_out(square4.$$.fragment, local);
    			transition_out(square5.$$.fragment, local);
    			transition_out(square6.$$.fragment, local);
    			transition_out(square7.$$.fragment, local);
    			transition_out(square8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(ol);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(table);
    			destroy_component(square0);
    			destroy_component(square1);
    			destroy_component(square2);
    			destroy_component(square3);
    			destroy_component(square4);
    			destroy_component(square5);
    			destroy_component(square6);
    			destroy_component(square7);
    			destroy_component(square8);
    			if (detaching) detach_dev(t20);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let imageName = "plane";
    	let show = new Array(9).fill("");

    	const handleClick = i => {
    		if (show[i] === "") {
    			$$invalidate(0, show[i] = imageName, show);
    		} else {
    			return;
    		}

    		imageName = imageName === "plane" ? "firetruck" : "plane";
    	};

    	function refresh() {
    		$$invalidate(0, show = new Array(9).fill(""));
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	const click_handler = evt => handleClick(0);
    	const click_handler_1 = evt => handleClick(1);
    	const click_handler_2 = evt => handleClick(2);
    	const click_handler_3 = evt => handleClick(3);
    	const click_handler_4 = evt => handleClick(4);
    	const click_handler_5 = evt => handleClick(5);
    	const click_handler_6 = evt => handleClick(6);
    	const click_handler_7 = evt => handleClick(7);
    	const click_handler_8 = evt => handleClick(8);

    	$$self.$capture_state = () => ({
    		Square,
    		imageName,
    		show,
    		handleClick,
    		refresh
    	});

    	$$self.$inject_state = $$props => {
    		if ("imageName" in $$props) imageName = $$props.imageName;
    		if ("show" in $$props) $$invalidate(0, show = $$props.show);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		show,
    		handleClick,
    		refresh,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
