!(function (t, e) {
  'object' == typeof exports && 'object' == typeof module
    ? (module.exports = e())
    : 'function' == typeof define && define.amd
    ? define([], e)
    : 'object' == typeof exports
    ? (exports._vantaEffect = e())
    : (t._vantaEffect = e())
})('undefined' != typeof self ? self : this, () =>
  (() => {
    'use strict'
    var t = {
        d: (e, s) => {
          for (var i in s)
            t.o(s, i) &&
              !t.o(e, i) &&
              Object.defineProperty(e, i, { enumerable: !0, get: s[i] })
        },
        o: (t, e) => Object.prototype.hasOwnProperty.call(t, e),
        r: (t) => {
          'undefined' != typeof Symbol &&
            Symbol.toStringTag &&
            Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
            Object.defineProperty(t, '__esModule', { value: !0 })
        },
      },
      e = {}
    function s(t, e) {
      return (
        null == t && (t = 0), null == e && (e = 1), t + Math.random() * (e - t)
      )
    }
    t.r(e),
      t.d(e, { default: () => u }),
      (Number.prototype.clamp = function (t, e) {
        return Math.min(Math.max(this, t), e)
      })
    const i = (t) => 0.299 * t.r + 0.587 * t.g + 0.114 * t.b
    function o(t) {
      for (; t.children && t.children.length > 0; )
        o(t.children[0]), t.remove(t.children[0])
      t.geometry && t.geometry.dispose(),
        t.material &&
          (Object.keys(t.material).forEach((e) => {
            t.material[e] &&
              null !== t.material[e] &&
              'function' == typeof t.material[e].dispose &&
              t.material[e].dispose()
          }),
          t.material.dispose())
    }
    const n = 'object' == typeof window
    let r = (n && window.THREE) || {}
    n && !window.VANTA && (window.VANTA = {})
    const h = (n && window.VANTA) || {}
    ;(h.register = (t, e) => (h[t] = (t) => new e(t))), (h.version = '0.5.24')
    const a = function () {
      return (
        Array.prototype.unshift.call(arguments, '[VANTA]'),
        console.error.apply(this, arguments)
      )
    }
    h.VantaBase = class {
      constructor(t = {}) {
        if (!n) return !1
        ;(h.current = this),
          (this.windowMouseMoveWrapper =
            this.windowMouseMoveWrapper.bind(this)),
          (this.windowTouchWrapper = this.windowTouchWrapper.bind(this)),
          (this.windowGyroWrapper = this.windowGyroWrapper.bind(this)),
          (this.resize = this.resize.bind(this)),
          (this.animationLoop = this.animationLoop.bind(this)),
          (this.restart = this.restart.bind(this))
        const e =
          'function' == typeof this.getDefaultOptions
            ? this.getDefaultOptions()
            : this.defaultOptions
        if (
          ((this.options = Object.assign(
            {
              mouseControls: !0,
              touchControls: !0,
              gyroControls: !1,
              minHeight: 200,
              minWidth: 200,
              scale: 1,
              scaleMobile: 1,
            },
            e
          )),
          (t instanceof HTMLElement || 'string' == typeof t) && (t = { el: t }),
          Object.assign(this.options, t),
          this.options.THREE && (r = this.options.THREE),
          (this.el = this.options.el),
          null == this.el)
        )
          a('Instance needs "el" param!')
        else if (!(this.options.el instanceof HTMLElement)) {
          const t = this.el
          if (((this.el = ((s = t), document.querySelector(s))), !this.el))
            return void a('Cannot find element', t)
        }
        var s, i
        this.prepareEl(), this.initThree(), this.setSize()
        try {
          this.init()
        } catch (t) {
          return (
            a('Init error', t),
            this.renderer &&
              this.renderer.domElement &&
              this.el.removeChild(this.renderer.domElement),
            void (
              this.options.backgroundColor &&
              (console.log('[VANTA] Falling back to backgroundColor'),
              (this.el.style.background =
                ((i = this.options.backgroundColor),
                'number' == typeof i
                  ? '#' + ('00000' + i.toString(16)).slice(-6)
                  : i)))
            )
          )
        }
        this.initMouse(), this.resize(), this.animationLoop()
        const o = window.addEventListener
        o('resize', this.resize),
          window.requestAnimationFrame(this.resize),
          this.options.mouseControls &&
            (o('scroll', this.windowMouseMoveWrapper),
            o('mousemove', this.windowMouseMoveWrapper)),
          this.options.touchControls &&
            (o('touchstart', this.windowTouchWrapper),
            o('touchmove', this.windowTouchWrapper)),
          this.options.gyroControls &&
            o('deviceorientation', this.windowGyroWrapper)
      }
      setOptions(t = {}) {
        Object.assign(this.options, t), this.triggerMouseMove()
      }
      prepareEl() {
        let t, e
        if ('undefined' != typeof Node && Node.TEXT_NODE)
          for (t = 0; t < this.el.childNodes.length; t++) {
            const e = this.el.childNodes[t]
            if (e.nodeType === Node.TEXT_NODE) {
              const t = document.createElement('span')
              ;(t.textContent = e.textContent),
                e.parentElement.insertBefore(t, e),
                e.remove()
            }
          }
        for (t = 0; t < this.el.children.length; t++)
          (e = this.el.children[t]),
            'static' === getComputedStyle(e).position &&
              (e.style.position = 'relative'),
            'auto' === getComputedStyle(e).zIndex && (e.style.zIndex = 1)
        'static' === getComputedStyle(this.el).position &&
          (this.el.style.position = 'relative')
      }
      applyCanvasStyles(t, e = {}) {
        Object.assign(t.style, {
          position: 'absolute',
          zIndex: 0,
          top: 0,
          left: 0,
          background: '',
        }),
          Object.assign(t.style, e),
          t.classList.add('vanta-canvas')
      }
      initThree() {
        r.WebGLRenderer
          ? ((this.renderer = new r.WebGLRenderer({
              alpha: !0,
              antialias: !0,
            })),
            this.el.appendChild(this.renderer.domElement),
            this.applyCanvasStyles(this.renderer.domElement),
            isNaN(this.options.backgroundAlpha) &&
              (this.options.backgroundAlpha = 1),
            (this.scene = new r.Scene()))
          : console.warn('[VANTA] No THREE defined on window')
      }
      getCanvasElement() {
        return this.renderer
          ? this.renderer.domElement
          : this.p5renderer
          ? this.p5renderer.canvas
          : void 0
      }
      getCanvasRect() {
        const t = this.getCanvasElement()
        return !!t && t.getBoundingClientRect()
      }
      windowMouseMoveWrapper(t) {
        const e = this.getCanvasRect()
        if (!e) return !1
        const s = t.clientX - e.left,
          i = t.clientY - e.top
        s >= 0 &&
          i >= 0 &&
          s <= e.width &&
          i <= e.height &&
          ((this.mouseX = s),
          (this.mouseY = i),
          this.options.mouseEase || this.triggerMouseMove(s, i))
      }
      windowTouchWrapper(t) {
        const e = this.getCanvasRect()
        if (!e) return !1
        if (1 === t.touches.length) {
          const s = t.touches[0].clientX - e.left,
            i = t.touches[0].clientY - e.top
          s >= 0 &&
            i >= 0 &&
            s <= e.width &&
            i <= e.height &&
            ((this.mouseX = s),
            (this.mouseY = i),
            this.options.mouseEase || this.triggerMouseMove(s, i))
        }
      }
      windowGyroWrapper(t) {
        const e = this.getCanvasRect()
        if (!e) return !1
        const s = Math.round(2 * t.alpha) - e.left,
          i = Math.round(2 * t.beta) - e.top
        s >= 0 &&
          i >= 0 &&
          s <= e.width &&
          i <= e.height &&
          ((this.mouseX = s),
          (this.mouseY = i),
          this.options.mouseEase || this.triggerMouseMove(s, i))
      }
      triggerMouseMove(t, e) {
        void 0 === t &&
          void 0 === e &&
          (this.options.mouseEase
            ? ((t = this.mouseEaseX), (e = this.mouseEaseY))
            : ((t = this.mouseX), (e = this.mouseY))),
          this.uniforms &&
            ((this.uniforms.iMouse.value.x = t / this.scale),
            (this.uniforms.iMouse.value.y = e / this.scale))
        const s = t / this.width,
          i = e / this.height
        'function' == typeof this.onMouseMove && this.onMouseMove(s, i)
      }
      setSize() {
        this.scale || (this.scale = 1),
          'undefined' != typeof navigator &&
          (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            navigator.userAgent
          ) ||
            window.innerWidth < 600) &&
          this.options.scaleMobile
            ? (this.scale = this.options.scaleMobile)
            : this.options.scale && (this.scale = this.options.scale),
          (this.width = Math.max(this.el.offsetWidth, this.options.minWidth)),
          (this.height = Math.max(this.el.offsetHeight, this.options.minHeight))
      }
      initMouse() {
        ;((!this.mouseX && !this.mouseY) ||
          (this.mouseX === this.options.minWidth / 2 &&
            this.mouseY === this.options.minHeight / 2)) &&
          ((this.mouseX = this.width / 2),
          (this.mouseY = this.height / 2),
          this.triggerMouseMove(this.mouseX, this.mouseY))
      }
      resize() {
        this.setSize(),
          this.camera &&
            ((this.camera.aspect = this.width / this.height),
            'function' == typeof this.camera.updateProjectionMatrix &&
              this.camera.updateProjectionMatrix()),
          this.renderer &&
            (this.renderer.setSize(this.width, this.height),
            this.renderer.setPixelRatio(window.devicePixelRatio / this.scale)),
          'function' == typeof this.onResize && this.onResize()
      }
      isOnScreen() {
        const t = this.el.offsetHeight,
          e = this.el.getBoundingClientRect(),
          s =
            window.pageYOffset ||
            (
              document.documentElement ||
              document.body.parentNode ||
              document.body
            ).scrollTop,
          i = e.top + s
        return i - window.innerHeight <= s && s <= i + t
      }
      animationLoop() {
        this.t || (this.t = 0), this.t2 || (this.t2 = 0)
        const t = performance.now()
        if (this.prevNow) {
          let e = (t - this.prevNow) / (1e3 / 60)
          ;(e = Math.max(0.2, Math.min(e, 5))),
            (this.t += e),
            (this.t2 += (this.options.speed || 1) * e),
            this.uniforms && (this.uniforms.iTime.value = 0.016667 * this.t2)
        }
        return (
          (this.prevNow = t),
          this.options.mouseEase &&
            ((this.mouseEaseX = this.mouseEaseX || this.mouseX || 0),
            (this.mouseEaseY = this.mouseEaseY || this.mouseY || 0),
            Math.abs(this.mouseEaseX - this.mouseX) +
              Math.abs(this.mouseEaseY - this.mouseY) >
              0.1 &&
              ((this.mouseEaseX += 0.05 * (this.mouseX - this.mouseEaseX)),
              (this.mouseEaseY += 0.05 * (this.mouseY - this.mouseEaseY)),
              this.triggerMouseMove(this.mouseEaseX, this.mouseEaseY))),
          (this.isOnScreen() || this.options.forceAnimate) &&
            ('function' == typeof this.onUpdate && this.onUpdate(),
            this.scene &&
              this.camera &&
              (this.renderer.render(this.scene, this.camera),
              this.renderer.setClearColor(
                this.options.backgroundColor,
                this.options.backgroundAlpha
              )),
            this.fps && this.fps.update && this.fps.update(),
            'function' == typeof this.afterRender && this.afterRender()),
          (this.req = window.requestAnimationFrame(this.animationLoop))
        )
      }
      restart() {
        if (this.scene)
          for (; this.scene.children.length; )
            this.scene.remove(this.scene.children[0])
        'function' == typeof this.onRestart && this.onRestart(), this.init()
      }
      init() {
        'function' == typeof this.onInit && this.onInit()
      }
      destroy() {
        'function' == typeof this.onDestroy && this.onDestroy()
        const t = window.removeEventListener
        t('touchstart', this.windowTouchWrapper),
          t('touchmove', this.windowTouchWrapper),
          t('scroll', this.windowMouseMoveWrapper),
          t('mousemove', this.windowMouseMoveWrapper),
          t('deviceorientation', this.windowGyroWrapper),
          t('resize', this.resize),
          window.cancelAnimationFrame(this.req)
        const e = this.scene
        e && e.children && o(e),
          this.renderer &&
            (this.renderer.domElement &&
              this.el.removeChild(this.renderer.domElement),
            (this.renderer = null),
            (this.scene = null)),
          h.current === this && (h.current = null)
      }
    }
    const l = h.VantaBase,
      c = 'object' == typeof window
    let p = c && window.THREE
    class d extends l {
      static initClass() {
        this.prototype.defaultOptions = {
          color: 16727937,
          color2: 16777215,
          size: 1,
          backgroundColor: 2299196,
          points: 10,
          maxDistance: 20,
          spacing: 15,
          showDots: !0,
        }
      }
      constructor(t) {
        ;(p = t.THREE || p), super(t)
      }
      genPoint(t, e, s) {
        let i
        if ((this.points || (this.points = []), this.options.showDots)) {
          const t = new p.SphereGeometry(0.25, 12, 12),
            e = new p.MeshLambertMaterial({ color: this.options.color })
          i = new p.Mesh(t, e)
        } else i = new p.Object3D()
        return (
          this.cont.add(i),
          (i.ox = t),
          (i.oy = e),
          (i.oz = s),
          i.position.set(t, e, s),
          (i.r = 0),
          this.points.push(i)
        )
      }
      onInit() {
        ;(this.cont = new p.Group()),
          this.cont.position.set(-50, -20, 0),
          this.scene.add(this.cont)
        let t = this.options.points,
          { spacing: e } = this.options
        const o = t * t * 2
        ;(this.linePositions = new Float32Array(o * o * 3)),
          (this.lineColors = new Float32Array(o * o * 3))
        const n = i(new p.Color(this.options.color)),
          r = i(new p.Color(this.options.backgroundColor))
        this.blending = n > r ? 'additive' : 'subtractive'
        const h = new p.BufferGeometry()
        h.setAttribute(
          'position',
          new p.BufferAttribute(this.linePositions, 3).setUsage(
            p.DynamicDrawUsage
          )
        ),
          h.setAttribute(
            'color',
            new p.BufferAttribute(this.lineColors, 3).setUsage(
              p.DynamicDrawUsage
            )
          ),
          h.computeBoundingSphere(),
          h.setDrawRange(0, 0)
        const a = new p.LineBasicMaterial({
          vertexColors: p.VertexColors,
          blending: 'additive' === this.blending ? p.AdditiveBlending : null,
          transparent: !0,
        })
        ;(this.linesMesh = new p.LineSegments(h, a)),
          this.cont.add(this.linesMesh)
        for (let s = 0; s <= t; s++)
          for (let i = 0; i <= t; i++) {
            const o = 0,
              n = (s - t / 2) * e
            let r = (i - t / 2) * e
            this.genPoint(n, o, r)
          }
        ;(this.camera = new p.PerspectiveCamera(
          20,
          this.width / this.height,
          0.01,
          1e4
        )),
          this.camera.position.set(50, 100, 150),
          this.scene.add(this.camera)
        const l = new p.AmbientLight(16777215, 0.75)
        this.scene.add(l),
          (this.spot = new p.SpotLight(16777215, 1)),
          this.spot.position.set(0, 200, 0),
          (this.spot.distance = 400),
          (this.spot.target = this.cont),
          this.scene.add(this.spot)
      }
      onUpdate() {
        let t
        null != this.helper && this.helper.update(),
          null != this.controls && this.controls.update()
        const e = this.camera
        Math.abs(e.tx - e.position.x) > 0.01 &&
          ((t = e.tx - e.position.x), (e.position.x += 0.02 * t)),
          Math.abs(e.ty - e.position.y) > 0.01 &&
            ((t = e.ty - e.position.y), (e.position.y += 0.02 * t)),
          c && window.innerWidth < 480
            ? e.lookAt(new p.Vector3(-10, 0, 0))
            : c && window.innerWidth < 720
            ? e.lookAt(new p.Vector3(-20, 0, 0))
            : e.lookAt(new p.Vector3(-40, 0, 0))
        let s = 0,
          i = 0,
          o = 0
        const n = new p.Color(this.options.backgroundColor),
          r = new p.Color(this.options.color),
          h = new p.Color(this.options.color2),
          a = r.clone().sub(n)
        this.rayCaster &&
          this.rayCaster.setFromCamera(
            new p.Vector2(this.rcMouseX, this.rcMouseY),
            this.camera
          )
        for (let t = 0; t < this.points.length; t++) {
          let e, h
          const l = this.points[t]
          h = this.rayCaster
            ? this.rayCaster.ray.distanceToPoint(l.position)
            : 1e3
          const c = h.clamp(5, 15)
          ;(l.scale.z = (0.25 * (15 - c)).clamp(1, 100)),
            (l.scale.x = l.scale.y = l.scale.z),
            (l.position.y =
              2 *
              Math.sin(
                l.position.x / 10 + 0.01 * this.t + (l.position.z / 10) * 0.5
              ))
          for (let h = t; h < this.points.length; h++) {
            const t = this.points[h],
              c = l.position.x - t.position.x,
              d = l.position.y - t.position.y,
              u = l.position.z - t.position.z
            if (
              ((e = Math.sqrt(c * c + d * d + u * u)),
              e < this.options.maxDistance)
            ) {
              let h,
                c = 2 * (1 - e / this.options.maxDistance)
              ;(c = c.clamp(0, 1)),
                (h =
                  'additive' === this.blending
                    ? new p.Color(0).lerp(a, c)
                    : n.clone().lerp(r, c)),
                (this.linePositions[s++] = l.position.x),
                (this.linePositions[s++] = l.position.y),
                (this.linePositions[s++] = l.position.z),
                (this.linePositions[s++] = t.position.x),
                (this.linePositions[s++] = t.position.y),
                (this.linePositions[s++] = t.position.z),
                (this.lineColors[i++] = h.r),
                (this.lineColors[i++] = h.g),
                (this.lineColors[i++] = h.b),
                (this.lineColors[i++] = h.r),
                (this.lineColors[i++] = h.g),
                (this.lineColors[i++] = h.b),
                o++
            }
          }
        }
        return (
          this.linesMesh.geometry.setDrawRange(0, 2 * o),
          (this.linesMesh.geometry.attributes.position.needsUpdate = !0),
          (this.linesMesh.geometry.attributes.color.needsUpdate = !0),
          0.001 * this.t
        )
      }
      onMouseMove(t, e) {
        const s = this.camera
        s.oy ||
          ((s.oy = s.position.y), (s.ox = s.position.x), (s.oz = s.position.z))
        const i = Math.atan2(s.oz, s.ox),
          o = Math.sqrt(s.oz * s.oz + s.ox * s.ox),
          n = i + 1.5 * (t - 0.5) * (this.options.mouseCoeffX || 1)
        ;(s.tz = o * Math.sin(n)),
          (s.tx = o * Math.cos(n)),
          (s.ty = s.oy + 80 * (e - 0.5) * (this.options.mouseCoeffY || 1)),
          this.rayCaster,
          (this.rcMouseX = 2 * t - 1),
          (this.rcMouseY = 2 * -t + 1)
      }
      onRestart() {
        this.scene.remove(this.linesMesh), (this.points = [])
      }
    }
    d.initClass()
    const u = h.register('GLOBE', d)
    return e
  })()
)
