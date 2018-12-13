riot.tag('timer',
  '<p>Seconds Elapsed: { time }</p>',
  'timer { display: block; border: 2px }',
  'class="tic-toc"',
  function (opts) {
    var self = this
    this.time = opts.start || 0

    this.tick = function () {
      self.update({ time: ++self.time })
    }

    var timer = setInterval(this.tick, 1000)

    this.on('unmount', function () {
      clearInterval(timer)
    })

  }
);

sim.registerWithLayout('timer');