/* eslint-disable */
// prettier-ignore

/*!
 * CustomEase 3.3.0
 * https://greensock.com
 *
 * @license Copyright 2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
 */

!(function(e, t) {
  'object' == typeof exports && 'undefined' != typeof module
    ? t(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], t)
    : t(((e = e || self).window = e.window || {}))
})(this, function(e) {
  'use strict'
  function m(e) {
    return Math.round(1e5 * e) / 1e5 || 0
  }
  var E = /[achlmqstvz]|(-?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
    b = /[\+\-]?\d*\.?\d+e[\+\-]?\d+/gi,
    Y = Math.PI / 180,
    k = Math.sin,
    B = Math.cos,
    F = Math.abs,
    J = Math.sqrt
  function arcToSegment(e, t, n, s, i, r, o, a, h) {
    if (e !== a || t !== h) {
      ;(n = F(n)), (s = F(s))
      var u = (i % 360) * Y,
        f = B(u),
        c = k(u),
        l = Math.PI,
        g = 2 * l,
        d = (e - a) / 2,
        v = (t - h) / 2,
        m = f * d + c * v,
        p = -c * d + f * v,
        x = m * m,
        y = p * p,
        w = x / (n * n) + y / (s * s)
      1 < w && ((n = J(w) * n), (s = J(w) * s))
      var C = n * n,
        M = s * s,
        E = (C * M - C * y - M * x) / (C * y + M * x)
      E < 0 && (E = 0)
      var b = (r === o ? -1 : 1) * J(E),
        P = ((n * p) / s) * b,
        S = ((-s * m) / n) * b,
        N = f * P - c * S + (e + a) / 2,
        D = c * P + f * S + (t + h) / 2,
        O = (m - P) / n,
        T = (p - S) / s,
        V = (-m - P) / n,
        _ = (-p - S) / s,
        q = O * O + T * T,
        A = (T < 0 ? -1 : 1) * Math.acos(O / J(q)),
        R =
          (O * _ - T * V < 0 ? -1 : 1) *
          Math.acos((O * V + T * _) / J(q * (V * V + _ * _)))
      isNaN(R) && (R = l),
        !o && 0 < R ? (R -= g) : o && R < 0 && (R += g),
        (A %= g),
        (R %= g)
      var G,
        L = Math.ceil(F(R) / (g / 4)),
        j = [],
        z = R / L,
        I = ((4 / 3) * k(z / 2)) / (1 + B(z / 2)),
        H = f * n,
        Q = c * n,
        Z = c * -s,
        U = f * s
      for (G = 0; G < L; G++)
        (m = B((i = A + G * z))),
          (p = k(i)),
          (O = B((i += z))),
          (T = k(i)),
          j.push(m - I * p, p + I * m, O + I * T, T - I * O, O, T)
      for (G = 0; G < j.length; G += 2)
        (m = j[G]),
          (p = j[G + 1]),
          (j[G] = m * H + p * Z + N),
          (j[G + 1] = m * Q + p * U + D)
      return (j[G - 2] = a), (j[G - 1] = h), j
    }
  }
  function stringToRawPath(e) {
    function ib(e, t, n, s) {
      ;(f = (n - e) / 3),
        (c = (s - t) / 3),
        a.push(e + f, t + c, n - f, s - c, n, s)
    }
    var t,
      n,
      s,
      i,
      r,
      o,
      a,
      h,
      u,
      f,
      c,
      l,
      g,
      d,
      v,
      m =
        (e + '')
          .replace(b, function(e) {
            var t = +e
            return t < 1e-4 && -1e-4 < t ? 0 : t
          })
          .match(E) || [],
      p = [],
      x = 0,
      y = 0,
      w = m.length,
      C = 0,
      M = 'ERROR: malformed path: ' + e
    if (!e || !isNaN(m[0]) || isNaN(m[1])) return console.log(M), p
    for (t = 0; t < w; t++)
      if (
        ((g = r),
        isNaN(m[t]) ? (o = (r = m[t].toUpperCase()) !== m[t]) : t--,
        (s = +m[t + 1]),
        (i = +m[t + 2]),
        o && ((s += x), (i += y)),
        t || ((h = s), (u = i)),
        'M' === r)
      )
        a && (a.length < 8 ? --p.length : (C += a.length)),
          (x = h = s),
          (y = u = i),
          (a = [s, i]),
          p.push(a),
          (t += 2),
          (r = 'L')
      else if ('C' === r)
        o || (x = y = 0),
          (a = a || [0, 0]).push(
            s,
            i,
            x + 1 * m[t + 3],
            y + 1 * m[t + 4],
            (x += 1 * m[t + 5]),
            (y += 1 * m[t + 6])
          ),
          (t += 6)
      else if ('S' === r)
        (f = x),
          (c = y),
          ('C' !== g && 'S' !== g) ||
            ((f += x - a[a.length - 4]), (c += y - a[a.length - 3])),
          o || (x = y = 0),
          a.push(f, c, s, i, (x += 1 * m[t + 3]), (y += 1 * m[t + 4])),
          (t += 4)
      else if ('Q' === r)
        (f = x + (2 / 3) * (s - x)),
          (c = y + (2 / 3) * (i - y)),
          o || (x = y = 0),
          (x += 1 * m[t + 3]),
          (y += 1 * m[t + 4]),
          a.push(f, c, x + (2 / 3) * (s - x), y + (2 / 3) * (i - y), x, y),
          (t += 4)
      else if ('T' === r)
        (f = x - a[a.length - 4]),
          (c = y - a[a.length - 3]),
          a.push(
            x + f,
            y + c,
            s + (2 / 3) * (x + 1.5 * f - s),
            i + (2 / 3) * (y + 1.5 * c - i),
            (x = s),
            (y = i)
          ),
          (t += 2)
      else if ('H' === r) ib(x, y, (x = s), y), (t += 1)
      else if ('V' === r) ib(x, y, x, (y = s + (o ? y - x : 0))), (t += 1)
      else if ('L' === r || 'Z' === r)
        'Z' === r && ((s = h), (i = u), (a.closed = !0)),
          ('L' === r || 0.5 < F(x - s) || 0.5 < F(y - i)) &&
            (ib(x, y, s, i), 'L' === r && (t += 2)),
          (x = s),
          (y = i)
      else if ('A' === r) {
        if (
          ((d = m[t + 4]),
          (v = m[t + 5]),
          (f = m[t + 6]),
          (c = m[t + 7]),
          (n = 7),
          1 < d.length &&
            (d.length < 3
              ? ((c = f), (f = v), n--)
              : ((c = v), (f = d.substr(2)), (n -= 2)),
            (v = d.charAt(1)),
            (d = d.charAt(0))),
          (l = arcToSegment(
            x,
            y,
            +m[t + 1],
            +m[t + 2],
            +m[t + 3],
            +d,
            +v,
            (o ? x : 0) + 1 * f,
            (o ? y : 0) + 1 * c
          )),
          (t += n),
          l)
        )
          for (n = 0; n < l.length; n++) a.push(l[n])
        ;(x = a[a.length - 2]), (y = a[a.length - 1])
      } else console.log(M)
    return (
      (t = a.length) < 6
        ? (p.pop(), (t = 0))
        : a[0] === a[t - 2] && a[1] === a[t - 1] && (a.closed = !0),
      (p.totalPoints = C + t),
      p
    )
  }
  function p() {
    return (
      y ||
      ('undefined' != typeof window &&
        (y = window.gsap) &&
        y.registerPlugin &&
        y)
    )
  }
  function q() {
    ;(y = p())
      ? (y.registerEase('_CE', n.create), (i = 1))
      : console.warn('Please gsap.registerPlugin(CustomEase)')
  }
  function s(e) {
    return ~~(1e3 * e + (e < 0 ? -0.5 : 0.5)) / 1e3
  }
  function v() {
    return String.fromCharCode.apply(null, arguments)
  }
  function C(e, t, n, s, i, r, o, a, h, u, f) {
    var c,
      l = (e + n) / 2,
      g = (t + s) / 2,
      d = (n + i) / 2,
      v = (s + r) / 2,
      m = (i + o) / 2,
      p = (r + a) / 2,
      x = (l + d) / 2,
      y = (g + v) / 2,
      w = (d + m) / 2,
      M = (v + p) / 2,
      E = (x + w) / 2,
      b = (y + M) / 2,
      P = o - e,
      S = a - t,
      N = Math.abs((n - o) * S - (s - a) * P),
      D = Math.abs((i - o) * S - (r - a) * P)
    return (
      u ||
        ((u = [
          { x: e, y: t },
          { x: o, y: a }
        ]),
        (f = 1)),
      u.splice(f || u.length - 1, 0, { x: E, y: b }),
      h * (P * P + S * S) < (N + D) * (N + D) &&
        ((c = u.length),
        C(e, t, l, g, x, y, E, b, h, u, f),
        C(E, b, w, M, m, p, o, a, h, u, f + 1 + (u.length - c))),
      u
    )
  }
  var y,
    i,
    t,
    r = 'CustomEase',
    o = v(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
    a = (function(e) {
      for (
        var t = false,
          n = [
            o,
            v(99, 111, 100, 101, 112, 101, 110, 46, 105, 111),
            v(
              99,
              111,
              100,
              101,
              112,
              101,
              110,
              46,
              112,
              108,
              117,
              109,
              98,
              105,
              110,
              103
            ),
            v(99, 111, 100, 101, 112, 101, 110, 46, 100, 101, 118),
            v(99, 115, 115, 45, 116, 114, 105, 99, 107, 115, 46, 99, 111, 109),
            v(99, 100, 112, 110, 46, 105, 111),
            v(103, 97, 110, 110, 111, 110, 46, 116, 118),
            v(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116),
            v(
              116,
              104,
              101,
              109,
              101,
              102,
              111,
              114,
              101,
              115,
              116,
              46,
              110,
              101,
              116
            ),
            v(99, 101, 114, 101, 98, 114, 97, 120, 46, 99, 111, 46, 117, 107),
            v(116, 121, 109, 112, 97, 110, 117, 115, 46, 110, 101, 116),
            v(116, 119, 101, 101, 110, 109, 97, 120, 46, 99, 111, 109),
            v(116, 119, 101, 101, 110, 108, 105, 116, 101, 46, 99, 111, 109),
            v(112, 108, 110, 107, 114, 46, 99, 111),
            v(104, 111, 116, 106, 97, 114, 46, 99, 111, 109),
            v(119, 101, 98, 112, 97, 99, 107, 98, 105, 110, 46, 99, 111, 109),
            v(97, 114, 99, 104, 105, 118, 101, 46, 111, 114, 103),
            v(99, 111, 100, 101, 115, 97, 110, 100, 98, 111, 120, 46, 105, 111),
            v(99, 115, 98, 46, 97, 112, 112),
            v(115, 116, 97, 99, 107, 98, 108, 105, 116, 122, 46, 99, 111, 109),
            v(99, 111, 100, 105, 101, 114, 46, 105, 111),
            v(
              109,
              111,
              116,
              105,
              111,
              110,
              116,
              114,
              105,
              99,
              107,
              115,
              46,
              99,
              111,
              109
            ),
            v(106, 115, 102, 105, 100, 100, 108, 101, 46, 110, 101, 116)
          ],
          s = n.length;
        -1 < --s;

      )
        if (-1 !== e.indexOf(n[s])) return !0
      return (
        t &&
          window &&
          window.console &&
          console.log(
            v(
              87,
              65,
              82,
              78,
              73,
              78,
              71,
              58,
              32,
              97,
              32,
              115,
              112,
              101,
              99,
              105,
              97,
              108,
              32,
              118,
              101,
              114,
              115,
              105,
              111,
              110,
              32,
              111,
              102,
              32
            ) +
              r +
              v(
                32,
                105,
                115,
                32,
                114,
                117,
                110,
                110,
                105,
                110,
                103,
                32,
                108,
                111,
                99,
                97,
                108,
                108,
                121,
                44,
                32,
                98,
                117,
                116,
                32,
                105,
                116,
                32,
                119,
                105,
                108,
                108,
                32,
                110,
                111,
                116,
                32,
                119,
                111,
                114,
                107,
                32,
                111,
                110,
                32,
                97,
                32,
                108,
                105,
                118,
                101,
                32,
                100,
                111,
                109,
                97,
                105,
                110,
                32,
                98,
                101,
                99,
                97,
                117,
                115,
                101,
                32,
                105,
                116,
                32,
                105,
                115,
                32,
                97,
                32,
                109,
                101,
                109,
                98,
                101,
                114,
                115,
                104,
                105,
                112,
                32,
                98,
                101,
                110,
                101,
                102,
                105,
                116,
                32,
                111,
                102,
                32,
                67,
                108,
                117,
                98,
                32,
                71,
                114,
                101,
                101,
                110,
                83,
                111,
                99,
                107,
                46,
                32,
                80,
                108,
                101,
                97,
                115,
                101,
                32,
                115,
                105,
                103,
                110,
                32,
                117,
                112,
                32,
                97,
                116,
                32,
                104,
                116,
                116,
                112,
                58,
                47,
                47,
                103,
                114,
                101,
                101,
                110,
                115,
                111,
                99,
                107,
                46,
                99,
                111,
                109,
                47,
                99,
                108,
                117,
                98,
                47,
                32,
                97,
                110,
                100,
                32,
                116,
                104,
                101,
                110,
                32,
                100,
                111,
                119,
                110,
                108,
                111,
                97,
                100,
                32,
                116,
                104,
                101,
                32,
                39,
                114,
                101,
                97,
                108,
                39,
                32,
                118,
                101,
                114,
                115,
                105,
                111,
                110,
                32,
                102,
                114,
                111,
                109,
                32,
                121,
                111,
                117,
                114,
                32,
                71,
                114,
                101,
                101,
                110,
                83,
                111,
                99,
                107,
                32,
                97,
                99,
                99,
                111,
                117,
                110,
                116,
                32,
                119,
                104,
                105,
                99,
                104,
                32,
                104,
                97,
                115,
                32,
                110,
                111,
                32,
                115,
                117,
                99,
                104,
                32,
                108,
                105,
                109,
                105,
                116,
                97,
                116,
                105,
                111,
                110,
                115,
                46,
                32,
                84,
                104,
                101,
                32,
                102,
                105,
                108,
                101,
                32,
                121,
                111,
                117,
                39,
                114,
                101,
                32,
                117,
                115,
                105,
                110,
                103,
                32,
                119,
                97,
                115,
                32,
                108,
                105,
                107,
                101,
                108,
                121,
                32,
                100,
                111,
                119,
                110,
                108,
                111,
                97,
                100,
                101,
                100,
                32,
                102,
                114,
                111,
                109,
                32,
                101,
                108,
                115,
                101,
                119,
                104,
                101,
                114,
                101,
                32,
                111,
                110,
                32,
                116,
                104,
                101,
                32,
                119,
                101,
                98,
                32,
                97,
                110,
                100,
                32,
                105,
                115,
                32,
                114,
                101,
                115,
                116,
                114,
                105,
                99,
                116,
                101,
                100,
                32,
                116,
                111,
                32,
                108,
                111,
                99,
                97,
                108,
                32,
                117,
                115,
                101,
                32,
                111,
                114,
                32,
                111,
                110,
                32,
                115,
                105,
                116,
                101,
                115,
                32,
                108,
                105,
                107,
                101,
                32,
                99,
                111,
                100,
                101,
                112,
                101,
                110,
                46,
                105,
                111,
                46
              )
          ),
        true
      )
    })(window ? window.location.host : ''),
    x = /[-+=\.]*\d+[\.e\-\+]*\d*[e\-\+]*\d*/gi,
    w = /[cLlsSaAhHvVtTqQ]/g,
    n =
      (((t = CustomEase.prototype).setData = function setData(e, t) {
        t = t || {}
        var n,
          s,
          i,
          r,
          o,
          a,
          h,
          u,
          f,
          c = (e = e || '0,0,1,1').match(x),
          l = 1,
          g = [],
          d = [],
          v = t.precision || 1,
          m = v <= 1
        if (
          ((this.data = e),
          (w.test(e) || (~e.indexOf('M') && e.indexOf('C') < 0)) &&
            (c = stringToRawPath(e)[0]),
          4 === (n = c.length))
        )
          c.unshift(0, 0), c.push(1, 1), (n = 8)
        else if ((n - 2) % 6) throw 'Invalid CustomEase'
        for (
          (0 == +c[0] && 1 == +c[n - 2]) ||
            (function _normalize(e, t, n) {
              n || 0 === n || (n = Math.max(+e[e.length - 1], +e[1]))
              var s,
                i = -1 * e[0],
                r = -n,
                o = e.length,
                a = 1 / (+e[o - 2] + i),
                h =
                  -t ||
                  (Math.abs(e[o - 1] - e[1]) < 0.01 * (e[o - 2] - e[0])
                    ? (function _findMinimum(e) {
                        var t,
                          n = e.length,
                          s = 1e20
                        for (t = 1; t < n; t += 6) +e[t] < s && (s = +e[t])
                        return s
                      })(e) + r
                    : +e[o - 1] + r)
              for (h = h ? 1 / h : -a, s = 0; s < o; s += 2)
                (e[s] = (+e[s] + i) * a), (e[s + 1] = (+e[s + 1] + r) * h)
            })(c, t.height, t.originY),
            this.segment = c,
            r = 2;
          r < n;
          r += 6
        )
          (s = { x: +c[r - 2], y: +c[r - 1] }),
            (i = { x: +c[r + 4], y: +c[r + 5] }),
            g.push(s, i),
            C(
              s.x,
              s.y,
              +c[r],
              +c[r + 1],
              +c[r + 2],
              +c[r + 3],
              i.x,
              i.y,
              1 / (2e5 * v),
              g,
              g.length - 1
            )
        for (n = g.length, r = 0; r < n; r++)
          (h = g[r]),
            (u = g[r - 1] || h),
            h.x > u.x || (u.y !== h.y && u.x === h.x) || h === u
              ? ((u.cx = h.x - u.x),
                (u.cy = h.y - u.y),
                (u.n = h),
                (u.nx = h.x),
                m &&
                  1 < r &&
                  2 < Math.abs(u.cy / u.cx - g[r - 2].cy / g[r - 2].cx) &&
                  (m = 0),
                u.cx < l &&
                  (u.cx
                    ? (l = u.cx)
                    : ((u.cx = 0.001),
                      r === n - 1 &&
                        ((u.x -= 0.001), (l = Math.min(l, 0.001)), (m = 0)))))
              : (g.splice(r--, 1), n--)
        if (((o = 1 / (n = (1 / l + 1) | 0)), (h = g[(a = 0)]), m)) {
          for (r = 0; r < n; r++)
            (f = r * o),
              h.nx < f && (h = g[++a]),
              (s = h.y + ((f - h.x) / h.cx) * h.cy),
              (d[r] = { x: f, cx: o, y: s, cy: 0, nx: 9 }),
              r && (d[r - 1].cy = s - d[r - 1].y)
          d[n - 1].cy = g[g.length - 1].y - s
        } else {
          for (r = 0; r < n; r++) h.nx < r * o && (h = g[++a]), (d[r] = h)
          a < g.length - 1 && (d[r - 1] = g[g.length - 2])
        }
        return (
          (this.ease = function(e) {
            var t = d[(e * n) | 0] || d[n - 1]
            return t.nx < e && (t = t.n), t.y + ((e - t.x) / t.cx) * t.cy
          }),
          (this.ease.custom = this).id && y.registerEase(this.id, this.ease),
          this
        )
      }),
      (t.getSVGData = function getSVGData(e) {
        return CustomEase.getSVGData(this, e)
      }),
      (CustomEase.create = function create(e, t, n) {
        return new CustomEase(e, t, n).ease
      }),
      (CustomEase.register = function register(e) {
        ;(y = e), q()
      }),
      (CustomEase.get = function get(e) {
        return y.parseEase(e)
      }),
      (CustomEase.getSVGData = function getSVGData(e, t) {
        var n,
          i,
          r,
          o,
          a,
          h,
          u,
          f,
          c,
          l,
          g = (t = t || {}).width || 100,
          d = t.height || 100,
          v = t.x || 0,
          p = (t.y || 0) + d,
          x = y.utils.toArray(t.path)[0]
        if (
          (t.invert && ((d = -d), (p = 0)),
          'string' == typeof e && (e = y.parseEase(e)),
          e.custom && (e = e.custom),
          e instanceof CustomEase)
        )
          n = (function rawPathToString(e) {
            !(function _isNumber(e) {
              return 'number' == typeof e
            })(e[0]) || (e = [e])
            var t,
              n,
              s,
              i,
              r = '',
              o = e.length
            for (n = 0; n < o; n++) {
              for (
                i = e[n],
                  r += 'M' + m(i[0]) + ',' + m(i[1]) + ' C',
                  t = i.length,
                  s = 2;
                s < t;
                s++
              )
                r +=
                  m(i[s++]) +
                  ',' +
                  m(i[s++]) +
                  ' ' +
                  m(i[s++]) +
                  ',' +
                  m(i[s++]) +
                  ' ' +
                  m(i[s++]) +
                  ',' +
                  m(i[s]) +
                  ' '
              i.closed && (r += 'z')
            }
            return r
          })(
            (function transformRawPath(e, t, n, s, i, r, o) {
              for (var a, h, u, f, c, l = e.length; -1 < --l; )
                for (h = (a = e[l]).length, u = 0; u < h; u += 2)
                  (f = a[u]),
                    (c = a[u + 1]),
                    (a[u] = f * t + c * s + r),
                    (a[u + 1] = f * n + c * i + o)
              return (e._dirty = 1), e
            })([e.segment], g, 0, 0, -d, v, p)
          )
        else {
          for (
            n = [v, p],
              o = 1 / (u = Math.max(5, 200 * (t.precision || 1))),
              f = 5 / (u += 2),
              c = s(v + o * g),
              i = ((l = s(p + e(o) * -d)) - p) / (c - v),
              r = 2;
            r < u;
            r++
          )
            (a = s(v + r * o * g)),
              (h = s(p + e(r * o) * -d)),
              (Math.abs((h - l) / (a - c) - i) > f || r === u - 1) &&
                (n.push(c, l), (i = (h - l) / (a - c))),
              (c = a),
              (l = h)
          n = 'M' + n.join(',')
        }
        return x && x.setAttribute('d', n), n
      }),
      CustomEase)
  function CustomEase(e, t, n) {
    i || q(), (this.id = e), a && this.setData(t, n)
  }
  p() && y.registerPlugin(n),
    (n.version = '3.3.0'),
    (e.CustomEase = n),
    (e.default = n)
  if (typeof window === 'undefined' || window !== e) {
    Object.defineProperty(e, '__esModule', { value: !0 })
  } else {
    delete e.default
  }
})
