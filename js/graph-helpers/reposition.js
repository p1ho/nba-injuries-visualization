"use strict"

/*
 Correct positioning to prevent text overlap
 The approach is to split the graph into 4 quadrants, with the origin centered
 at around the chest area.
 Then for the coordinates above the chest area, if there's overlap, we push
 the upper coordinate upwards.
 For the coordinates below the chest area, if there's overlap, we push the
 lower coordinate downwards.
 */

function reposition(traces) {

  const originY = 2
  const lineHeight = .125 // guestimate
  var limits = {
    upperLeft: originY,
    upperRight: originY,
    lowerLeft: originY,
    lowerRight: originY
  }

  let tracesUpper = traces.filter(trace => trace.y[1] >= originY)
  let tracesUpperSorted = tracesUpper.sort((a, b) => {
    return a.y[1] > b.y[1] ? 1 : -1
  })

  tracesUpperSorted.forEach(e => {
    let blockHeight = e.entrycount * lineHeight
    let upperBound = e.y[0] + lineHeight / 2
    let lowerBound = upperBound - blockHeight
    if (e.x[0] < 0) { // left
      if (lowerBound < limits.upperLeft) {
        e.y[0] = limits.upperLeft + blockHeight
        upperBound = e.y[0] + lineHeight / 2
        lowerBound = upperBound - blockHeight
      }
      if (upperBound > limits.upperLeft) {
        limits.upperLeft = upperBound
      }
      if (lowerBound < limits.lowerLeft) {
        limits.lowerLeft = lowerBound
      }
    } else { // right
      if (lowerBound < limits.upperRight) {
        e.y[0] = limits.upperRight + blockHeight
        upperBound = e.y[0] + lineHeight / 2
        lowerBound = upperBound - blockHeight
      }
      if (upperBound > limits.upperRight) {
        limits.upperRight = upperBound
      }
      if (lowerBound < limits.lowerRight) {
        limits.lowerRight = lowerBound
      }
    }
  })

  let tracesLower = traces.filter(trace => trace.y[1] < originY)
  let tracesLowerSorted = tracesLower.sort((a, b) => {
    return a.y[1] < b.y[1] ? 1 : -1
  })

  tracesLowerSorted.forEach(e => {
    let blockHeight = e.entrycount * lineHeight
    let upperBound = e.y[0] + lineHeight / 2
    let lowerBound = upperBound - blockHeight
    if (e.x[0] < 0) { // left
      if (upperBound > limits.lowerLeft) {
        e.y[0] = limits.lowerLeft - blockHeight
        upperBound = e.y[0] + lineHeight / 2
        lowerBound = upperBound - blockHeight
      }
      if (lowerBound < limits.lowerLeft) {
        limits.lowerLeft = lowerBound
      }
    } else { // right
      if (upperBound > limits.lowerRight) {
        e.y[0] = limits.lowerRight - blockHeight
        upperBound = e.y[0] + lineHeight / 2
        lowerBound = upperBound - blockHeight
      }
      if (lowerBound < limits.lowerRight) {
        limits.lowerRight = lowerBound
      }
    }
  })

  return tracesUpperSorted.concat(tracesLowerSorted)

}
