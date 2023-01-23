
(() => {
    console.log(fxhash);
    const e = document.createElement("a"),
        // just fxrand
        // set attribute of an xml element
        ans = (e, t, a) => {
            e.setAttributeNS(null, t, a)
        },

        // add child to xml element
        ac = (e, t) => {
            e.appendChild(t)
        },

        sin45 = Math.sin(Math.PI/4),
        cos45 = sin45,

        dist = function(r, e, o, n) {
            r = o - r;
            e = n - e;
            return Math.sqrt(r * r + e * e);
        },

        makeNoiseFilter = function(id, turbfreq, scale) {
            let name = id.toUpperCase();
            let filterElement = mycreate("filter");
            ans(filterElement, "id", id);
            ans(filterElement, "x", "0%");
            ans(filterElement, "y", "0%");
            ans(filterElement, "width", "200%");
            ans(filterElement, "height", "200%");

            let turbulenceElement = mycreate("feTurbulence");
            ans(turbulenceElement, "baseFrequency", turbfreq);
            ans(turbulenceElement, "result", name);
            ans(turbulenceElement, "numOctaves", 2);

            let displacementElement = mycreate("feDisplacementMap");
            ans(displacementElement, "in", "SourceGraphic");
            ans(displacementElement, "in2", name);
            ans(displacementElement, "scale", scale);
            ans(displacementElement, "xChannelSelector", "R");
            ans(displacementElement, "yChannelSelector", "R");

            ac(filterElement, turbulenceElement);
            ac(filterElement, displacementElement);
            return filterElement;
        },

        od = (a) => {
            return fxrand() <= a
        },

        degrees = function(a) {
            return a * 180 / Math.PI;
        },

        rb = function(a, b) {
            return a + (b - a) * fxrand();
        },

        rint = function(a, b) {
            return Math.floor(rb(a, b));
        },

        wc = function(a) {
            const b = fxrand();
            let c = 0;
            for (let e = 0; e < a.length - 1; e += 2) {
                const f = a[e],
                    g = a[e + 1];
                if (c += g, b < c) return f
            }
            return a[a.length - 2]
        },

        pick = function(a) {
            let len = a.length;
            return a[Math.floor(rb(0, len))];
        },

        pickIndex = function(a) {
            let len = a.length;
            return Math.floor(rb(0, len));
        },

        shuffleArray = function(array) {
            for (let i = array.length - 1; i > 0; i--) {
                let j = Math.floor(fxrand() * (i + 1));
                let temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
        },

        copyRect = function(arr) {
            let copy = [];
            for (let i = 0; i < arr.length; i++) {
                if (Array.isArray(arr[i])) {
                    copy.push(Array.from(arr[i]));
                } else {
                    copy.push(arr[i]);
                }
            }
            return copy;
        },

        // ceiling
        myceil = e => Math.ceil(e),

        // floor
        myfloor = e => Math.floor(e);

        let canvasElement = null,

        disableGrain = false,

        // pixel resolution, aspect ratio (relvant for printing to png i think)
        // x p are svg dimensions
        svgWidth = 3780,
        svgHeight = 1.333*svgWidth,
        //p = 2673,
        // b y are canvas dimensions
        canvasWidth = isFxpreview ? 2100 : svgWidth,
        canvasHeight = canvasWidth / (svgWidth / svgHeight),

        // cream color, every piece has it
        BG_COLOR = "#F4EEDC",

        fillOpacity = 1,

        WIDTH = "width",
        HEIGHT = "height",
        FILL = "fill";

    window.$fxhashFeatures = {

    };
    //console.table(window.$fxhashFeatures);

    // adding elements to the svg
    const mycreate = (e, t) => {
        let a = document.createElementNS(t, e);
        return t && a.setAttribute("xmlns", t), a
    };

    function myrect(x, y, width, height, color, transform, drawingLevelSvg) {
        // if (transform === null) {
        //
        //     let nextRectangle = mycreate("rect");
        //     ans(nextRectangle, "x", x);
        //     ans(nextRectangle, "y", y);
        //     ans(nextRectangle, WIDTH, width);
        //     ans(nextRectangle, HEIGHT, height);
        //     ans(nextRectangle, FILL, color);
        //     ans(nextRectangle, "stroke", color);
        //     ans(nextRectangle, "stroke-width", 2);
        //     ans(nextRectangle, "fill-opacity", fillOpacity);
        //     if (transform !== null && transform.length > 0) {
        //         ans(nextRectangle, "transform", transform);
        //     }
        //     //ans(nextRectangle, "filter", "url(#noise)");
        //     //ac(drawingLevelSvg, nextRectangle);
        // }

        let nextRectangle2 = mycreate("rect");
        ans(nextRectangle2, "x", x);
        ans(nextRectangle2, "y", y);
        ans(nextRectangle2, WIDTH, width);
        ans(nextRectangle2, HEIGHT, height);
        ans(nextRectangle2, FILL, color);
        ans(nextRectangle2, "stroke", color);
        ans(nextRectangle2, "stroke-width", 2);
        ans(nextRectangle2, "fill-opacity", fillOpacity);
        if (transform !== null && transform.length > 0) {
            ans(nextRectangle2, "transform", transform);
        }
        ans(nextRectangle2, "filter", "url(#noise)");
        ac(drawingLevelSvg, nextRectangle2);
    }

    function mycircle(circle1X, circle1Y, radius, color, drawingLevelSvg) {
        let circle1 = mycreate("circle");
        ans(circle1, "cx", circle1X);
        ans(circle1, "cy", circle1Y);
        ans(circle1, "r", radius);
        ans(circle1, FILL, color);
        ac(drawingLevelSvg, circle1);
    }

    window.addEventListener("load", (function () {
        Date.now();
        canvasElement = document.createElement("canvas");
        ans(canvasElement, WIDTH, canvasWidth);
        ans(canvasElement, HEIGHT, canvasHeight);
        let div = document.getElementById("cw");
        ac(div, canvasElement);
        let SVG_XML = (() => {
            // top level svg xml element
            let wunits = 1000;
            let hunits = 1333;

            let topLevelSvg = mycreate("svg", "http://www.w3.org/2000/svg");
            ans(topLevelSvg, "version", "1.1");
            ans(topLevelSvg, "viewBox", "0 0 " + wunits + " " + hunits);
            ans(topLevelSvg, WIDTH, svgWidth);
            ans(topLevelSvg, HEIGHT, svgHeight);

            // svg filter xml. TODO: study how these filters work and what params can be tweaked and what other filters there are
            let noiseRand = Math.floor(1000*rb(1,4));
            //console.log('noise rand = ' + noiseRand);

            let noiseFilterElement = makeNoiseFilter("noise", "1.2" + noiseRand + " 0.02", 10);
            ac(topLevelSvg, noiseFilterElement);

            // let arcNoiseElement = makeNoiseFilter("noisearc", "1.22 0.02", 6);
            // ac(topLevelSvg, arcNoiseElement);

            // master rect for the sketch
            let masterRect = mycreate("rect");
            ans(masterRect, WIDTH, "100%");
            ans(masterRect, HEIGHT, "100%");
            ans(masterRect, FILL, BG_COLOR);
            ac(topLevelSvg, masterRect);

            // 2nd level svg for the biz logic
            let drawingLevelSvg = mycreate("svg", "http://www.w3.org/2000/svg");
            ans(drawingLevelSvg, "version", "1.1");
            //ans(drawingLevelSvg, "filter", "url(#noise)");

            let lmargin = 14;
            let rmargin = 18;
            let tmargin = 14;
            let bmargin = 18;
            //let colGap = 16;
            //let numCols = 13;

            //let colGap = 24;
            //let numCols = 15;

            let numColOptions = [13, 15];
            let colGapOptions = [27, 24];

            let pi = 1;//pickIndex(numColOptions);
            let numCols = numColOptions[pi];
            let colGap = colGapOptions[pi];

            // let colGap = 16;
            // let numCols = 13;

            //let primaryColor = pick(["#C10100", "#2A201B"]);
            let a1 = [{'name':'Red','color':"#C10100"},{'name':'Black','color':"#030303"}];
            let primaryColorObj = pick(a1);
            let primaryColor = primaryColorObj.color;

            let colWidth = (wunits - lmargin - rmargin - colGap * (numCols - 1)) / numCols;
            let fullRectHeight = hunits - tmargin - bmargin;

            let arcChoices = [
                // DEBUG
                ////['arc',1,1],
                ['arc-', 1,1,1],
                ['arc-', 1,2,1],
                ////['arc',2,2],
                //['arc-',2,1,2],
                //['arc-',2,2,2]
            ];

            function sumRect(rects) {
                let sum = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i])) {
                        sum += sumRect(rects[i]);
                    } else if (typeof rects[i] !== 'string') {
                        sum += Math.abs(rects[i]);
                    }
                }

                return sum;
            }

            let newRects = [];

            if (false && od(0.02)) {
                for (let i = 0; i < 5; i++) {
                    newRects.push(Array.from(arcChoices[0]));
                }
            } else {

                //while ((allThinArcs(newRects) && getNumArcs(newRects) <= 1) || (!allThinArcs(newRects) && getNumArcs(newRects) < 1)) {
                while (getNumArcs(newRects) <= 1) {
                    //console.log('fill new rects with arcs and lines');
                    newRects = [];

                    let arcChoiceIndex = pickIndex(arcChoices);
                    let selectedArc = arcChoices[arcChoiceIndex];
                    let sumArcChoice = sumRect(selectedArc);
                    newRects.push(Array.from(selectedArc));

                    let allowArcChange = od(0.4);


                    //console.log('sum of arc = ' + sumArcChoice);

                    let spaceLeft = numCols - sumRect(newRects);
                    while (spaceLeft > 0) {
                        if (allowArcChange) {
                            arcChoiceIndex = pickIndex(arcChoices);
                            selectedArc = arcChoices[arcChoiceIndex];
                            sumArcChoice = sumRect(selectedArc);
                        }


                        // 1 to spaceleft, pick a number and add to the rects
                        let next = rint(1, Math.min(7, spaceLeft));
                        if (next === sumArcChoice && sumArcChoice < 7 && od(0.95)) {
                            newRects.push(Array.from(selectedArc));
                            //console.log('pushed same arc = ' + selectedArc);
                        } else if (next <= 2 || next === 4) {
                            newRects.push(next);
                            //console.log('push next = ' + next);
                        } else {
                            //console.log('skip, it is too big = ' + next);
                        }

                        spaceLeft = numCols - sumRect(newRects);
                    }
                }
            }

            //console.log('sum rects = ' + sumRect(newRects));
            function arcAtEnd(rects) {
                if (rects.length === 0) {
                    return false;
                }
                let first = rects[0];
                let last = rects[rects.length-1];
                //console.log('arc at end debug first ' + first);

                if (Array.isArray(first) && first[0].startsWith('arc')) {
                    return true;
                }
                else if (Array.isArray(last) && last[0].startsWith('arc')) {
                    return true;
                } else {
                    return false;
                }
            }

            function getDirection(r0) {
                let r1 = r0.replace('arc-', '');
                return r1.split('-')[0];
            }

            function getNumArcs(rects) {
                let num = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i]) && rects[i][0].startsWith('arc')) {
                        num++;
                    }
                }
                return num;
            }

            function allThinArcs(rects) {
                let num = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i]) && rects[i][0].startsWith('arc')) {
                        if (rects[i][1] === 1) {
                            num++;
                        } else {
                            return false;
                        }
                    }
                }
                return num > 0;
            }

            function allThickArcs(rects) {
                let num = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i]) && rects[i][0].startsWith('arc')) {
                        if (rects[i][1] === 2) {
                            num++;
                        } else {
                            return false;
                        }
                    }
                }
                return num > 0;
            }

            function isArc(working) {
                return Array.isArray(working) && working[0].startsWith('arc');
            }

            //!stuffBetweenArc(newRects) || !fourArcsConsecutive(newRects)));

            function stuffBetweenArc(rects) {
                // go through every entry
                // if prev was arc, make sure current is not arc also!
                let prev = null;
                for (let i = 0; i < rects.length; i++) {
                    let current = rects[i];
                    if (prev !== null && isArc(prev) && isArc(current)) {
                        return false;
                    }

                    prev = current;
                }
                return true;
            }

            function getArc(rects, index) {
                let num = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i]) && rects[i][0].startsWith('arc')) {
                        if (num === index) {
                            return rects[i];
                        }
                        num++;
                    }
                }
                return null;
            }

            function indexOfArc(rects) {
                let index = 0;
                for (let i = 0; i < rects.length; i++) {
                    if (Array.isArray(rects[i]) && rects[i][0].startsWith('arc')) {
                        return index;
                    }
                    index++;
                }
                return null;
            }

            function sameArcDirectionInARow(rects) {
                let prev = null;
                for (let i = 0; i < rects.length; i++) {
                    let working = rects[i];
                    if (prev === null) {
                        prev = working;
                        continue;
                    }

                    if (Array.isArray(prev) && Array.isArray(working)) {
                        if (getDirection(prev[0]) === getDirection(working[0])) {

                            //console.log('same direction arc! boring :(');
                            return true;
                        }

                        let aap = getArcAttributes(prev[0]);
                        let aaw = getArcAttributes(working[0]);
                         // if both no fill and diff heights, nuke
                        if (!aap.shouldFill && !aaw.shouldFill) {
                            if (aap.startHeight !== aaw.startHeight) {
                                return true;
                            }
                        }

                        prev = working;
                    } else {
                        prev = working;
                        continue;
                    }

                }
                return false;
            }

            // boring if 2 arcs are exactly the same: direction, fill, starting height.
            // also if same direction and too close in starting height (regardless of any fills)
            function twoBoringArcs(rects) {
                if (getNumArcs(rects) !== 2) {
                    return false;
                }

                let a1 = getArc(rects,0);
                let a2 = getArc(rects,1);


                //console.log('two boring ? ' + a1[0] + " " + a2[0]);

                if (a1[0] === a2[0]) {
                    return true;
                }

                let arcAtt1 = getArcAttributes(a1[0]);
                let arcAtt2 = getArcAttributes(a2[0]);

                if (arcAtt1.downUp === arcAtt2.downUp && (Math.abs(arcAtt1.startHeight - arcAtt2.startHeight) <= 1)) {
                    return true;
                }

                return false;
            }

            function getArcAttributes(arcStr) {
                let parts = arcStr.split('-');
                let offset = 0;
                if (parts[0] === 'arc') {
                    offset = 1;
                }
                let downup = parts[0+offset] === 'du';
                let shouldFill = parts[1+offset] !== 'nf';
                let fillAbove = shouldFill && parts[1+offset] === 'fa';
                let fillBelow = shouldFill && parts[1+offset] === 'fb';
                let pickStartHeight = parseInt(parts[2+offset]);

                return {downUp:downup, shouldFill:shouldFill,fillAbove:fillAbove,fillBelow:fillBelow,startHeight:pickStartHeight};
            }

            function fillsTooLarge(rects) {
                // get arcs
                // get attr
                for (let i = 0; i < rects.length; i++) {
                    let working = rects[i];
                    if (!isArc(working)) {
                        continue;
                    }

                    let attr = getArcAttributes(working[0]);
                    if (!attr.shouldFill) {
                        return false;
                    }
                    if (attr.fillAbove && attr.startHeight >= 2) {
                        return false;
                    }

                    if (attr.fillBelow && attr.startHeight <= 2) {
                        return false;
                    }
                }
                return true;
                // fa and 0 or 1
                // fb and 4 or 5
                // if all are like that, too large!
            }

            // boring if 2 arcs have no fills, same direction, and have anything other than pure 1 lines in between them
            function twoBoringArcs2(rects) {
                if (getNumArcs(rects) !== 2) {
                    return false;
                }

                let a1 = getArc(rects,0);
                let a2 = getArc(rects,1);

                let arcAtt1 = getArcAttributes(a1[0]);
                let arcAtt2 = getArcAttributes(a2[0]);

                if (arcAtt1.shouldFill || arcAtt2.shouldFill) {
                    return false;
                }

                // if (arcAtt1.downUp !== arcAtt2.downUp) {
                //     return false;
                // }

                if (arcAtt1.startHeight === arcAtt2.startHeight) {
                    return true;
                }

                //console.log('arc att = ' + JSON.stringify(arcAtt));

                let inBetweenArcs = false;
                for (let i = 0; i < rects.length; i++) {
                    let working = rects[i];
                    if (isArc(working)) {
                        inBetweenArcs = !inBetweenArcs;
                    } else if (inBetweenArcs) {
                        if (working !== 1) {
                            //console.log('twoBoringArcs2 return true!');
                            //alert('twoBoringArcs2');
                            return true;
                        }
                    }
                }
                //console.log('twoBoringArcs2 return false!');
                return od(0.5);
                //return false;
            }

            function twoBoringFilledArcs(rects) {
                if (getNumArcs(rects) !== 2) {
                    return false;
                }

                let a1 = getArc(rects,0);
                let a2 = getArc(rects,1);

                // same direction, no fill, and same starting height

                //console.log('two boring ? ' + a1[0] + " " + a2[0]);

                let boring = (a1[0].indexOf('-fa-') !== -1 && a2[0].indexOf('-fa-') !== -1) ||
                    (a1[0].indexOf('-fb-') !== -1 && a2[0].indexOf('-fb-') !== -1);
                //console.log('two boring filled arcs = ' + boring);
                return boring;
            }



            let cleanRects = copyRect(newRects);
            //console.log('after first clean copy = ' + cleanRects);

            let isBoring = true;

            let numTriesLeft = 100;
            while (isBoring || arcAtEnd(newRects)) {

                //console.log('num tries left = ' + numTriesLeft);

                newRects = copyRect(cleanRects);
                //console.log('after clean copy = ' + newRects);

                // set arc params
                for (let i = 0; i < newRects.length; i++) {
                    let working = newRects[i];
                    if (Array.isArray(working) && working[0].startsWith('arc')) {
                        //console.log('found arc = ' + working);

                        // flip coin for du or ud
                        let du = od(0.5) ? 'du' : 'ud';
                        let sf = od(0.5) ? 'nf' : (od(0.5) ? 'fa' : 'fb');
                        let sy = rint(0, 5);

                        // //DEBUG
                        // let du = 'du';//od(0.5) ? 'du' : 'ud';
                        // let sf = 'fa';
                        // let sy = rint(0, 5);

                        if (working[1] > 1) {
                            sf = 'nf';
                        }

                        working[0] = 'arc-' + [du, sf, sy].join('-');
                    }
                }

                // DEBUG
                //newRects = [2,1,['arc-du-nf-3',1,1,1],['arc-ud-nf-3',1,2,1],2,1,2];
                //newRects = [1,['arc-du-nf-0',1,1,1],4,['arc-ud-nf-1',1,1,1],4];
                //newRects = [2, ['arc-up-fb-4',1,1,1], 1,4,['arc-du-fa-0',1,1,1],2];

                //newRects = [1,1,1,1,1,1,1,1,['arc-du-nf-0',1,1,1],['arc-du-nf-0',1,1,1],1];
                // can shuffle newRects as you like and the arc and other groupings are maintained
                // DEBUG
                shuffleArray(newRects);

                //console.log('all thin arcs = ' + allThinArcs(newRects));
                //console.log('same dir in a row = ' + (sameArcDirectionInARow(newRects)));


                // TODO: many ways to be boring. one is 2 arcs next to each other w the same direction
                //isBoring = (allThinArcs(newRects) && (sameArcDirectionInARow(newRects) || twoBoringArcs(newRects) || twoBoringFilledArcs(newRects))) || (allDoubleArcs(newRects) && / no stuff in between / || // stuff between but not enough diff in the 2 arcs //);
                isBoring = (allThinArcs(newRects) && (sameArcDirectionInARow(newRects) || twoBoringArcs(newRects) || twoBoringFilledArcs(newRects) || twoBoringArcs2(newRects) || fillsTooLarge(newRects)));
                // 2 lines

                numTriesLeft--;
                if (numTriesLeft <= 0) {
                    break;
                }
            }


            // TODO: symmetry patterns
            // TODO: groups with arcs 12121

            //let primaryColor = "#C10100";

            function drawCurvedPath(rects, startx, yesDraw) {

                let arcType = rects[0].replace('arc-','');

                //console.log('arc type = ' + arcType);

                // DEBUG
                let shouldFill;// = absWidth1 === 1 && od(0.5);
                let fillAbove;// = shouldFill && od(0.5);
                let fillBelow;// = shouldFill && !fillAbove;

                let downup;

                let pickStartHeight;// = rint(0,5);

                if (arcType.trim() === '') {
                    shouldFill = false;
                    fillAbove = false;
                    fillBelow = false;
                    downup = true;
                    pickStartHeight = 0;
                } else {
                    let parts = arcType.split('-');
                    downup = parts[0] === 'du';
                    shouldFill = parts[1] !== 'nf';
                    fillAbove = shouldFill && parts[1] === 'fa';
                    fillBelow = shouldFill && parts[1] === 'fb';
                    pickStartHeight = parseInt(parts[2]);
                }

                let absWidth1 = Math.abs(rects[1]);

                // console.log('fill above = ' + fillAbove);
                // console.log('fill below = ' + fillBelow);
                //
                // console.log('draw arc = ' + rects);

                let drawWidth1 = absWidth1 * colWidth + colGap * (absWidth1 - 1);
                let startSecondRect = startx;
                let horizontalDrawWidth = 0;
                horizontalDrawWidth += drawWidth1;
                horizontalDrawWidth += colGap;
                horizontalDrawWidth += drawWidth1;

                startSecondRect += drawWidth1 + colGap;

                if (rects.length === 4) {
                    let absWidthSpacer;
                    let drawWidthSpacer;
                    absWidthSpacer = Math.abs(rects[2]);
                    drawWidthSpacer = absWidthSpacer * colWidth + colGap * (absWidthSpacer - 1);

                    horizontalDrawWidth += drawWidthSpacer;
                    horizontalDrawWidth += colGap;

                    startSecondRect += drawWidthSpacer;
                    startSecondRect += colGap;

                } else if (rects.length === 3) {

                }

                //console.log('check return early 1');

                if (!yesDraw) {
                    //console.log('returned early yes');
                    return horizontalDrawWidth;
                }

                //console.log('check return early 2');

                // turning radius. this needs to be tweaked based on the distance between the arc start and end.
                // TODO: calculate min multiple based on the exact start/end. if point 6 is < 3 on x or > 3 on y, radius is too big. cut in half until it's not
                let ratio = (startSecondRect - startx) / drawWidth1;
                //console.log('ratio = ' + myfloor(ratio));
                let turningCircleRadius = myfloor(ratio) * drawWidth1;

                // DEBUG
                //let downup = od(0.5);

                // draw curve from bottom going up
                if (downup) {

                    // TODO: start of arc can be 1 of a few locations
                    let arcStartFromBottom = 0;

                    // round 1 we figure out how tall this curve will be. then we find where to start it and rerun with that in mind + draw on round 2
                    for (let round = 1; round <= 2; round++) {

                        // 4 points for first turn
                        let circle1x = startx;
                        let circle1y = fullRectHeight + tmargin - arcStartFromBottom;
                        //mycircle(circle1X, circle1Y, 6, "#000000", drawingLevelSvg);

                        let circle2x = startx + drawWidth1;
                        let circle2y = fullRectHeight + tmargin - arcStartFromBottom;
                        //mycircle(circle2X, circle2Y, 6, "#000000", drawingLevelSvg);

                        let myturning1x = startx + drawWidth1 + turningCircleRadius;
                        let myturning1y = fullRectHeight+tmargin-arcStartFromBottom;
                        //mycircle(myturning1x, myturning1y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                        let circle3x = startx + drawWidth1 + turningCircleRadius - turningCircleRadius * sin45;
                        let circle3y = fullRectHeight + tmargin - arcStartFromBottom - turningCircleRadius * cos45;
                        //mycircle(circle3X, circle3Y, 6, "#000000", drawingLevelSvg);

                        let largeArcRadius = turningCircleRadius + drawWidth1;
                        let circle4x = startx + drawWidth1 + turningCircleRadius - largeArcRadius * sin45;
                        let circle4y = fullRectHeight + tmargin - arcStartFromBottom - largeArcRadius * cos45;
                        //mycircle(circle4X, circle4Y, 6, "#000000", drawingLevelSvg);

                        //myrect(startSecondRect, tmargin, drawWidth1, fullRectHeight, "#ffffff", null, drawingLevelSvg);

                        // diagonal rect
                        let xdiff = circle4x - circle1x;
                        let dotx = startSecondRect + drawWidth1 - xdiff;

                        // y = mx + b
                        // y = -x + c4y + c4x
                        let intery = -1 * dotx + circle3x + circle3y;
                        //console.log('inter y = ' + intery);

                        let circle6x = dotx;
                        let circle6y = intery;

                        // distance from circle 3 to intersection point. that is the rectangle height
                        let diagRectHeight = dist(circle3x, circle3y, circle6x, circle6y);
                        //console.log('diag rect height = ' + diagRectHeight);

                        //mycircle(circle6x, circle6y, 6, "#00ff00", drawingLevelSvg);

                        let circle5x = dotx - cos45 * drawWidth1;
                        let circle5y = intery - sin45 * drawWidth1;
                        //mycircle(circle5x, circle5y, 6, "#0000ff", drawingLevelSvg);

                        let turning2x = circle5x - turningCircleRadius * cos45;
                        let turning2y = circle5y - turningCircleRadius * sin45;

                        //mycircle(turning2x, turning2y, turningCircleRadius, "#ffffff", drawingLevelSvg);


                        // 4 points for final turn
                        let circle8x = startSecondRect;
                        let circle8y = turning2y;
                        //mycircle(circle8x, circle8y, 6, '#00ffff', drawingLevelSvg);

                        let circle7x = startSecondRect + drawWidth1;
                        let circle7y = turning2y;
                        //mycircle(circle7x, circle7y, 6, '#000000', drawingLevelSvg);

                        // figure out arc start point
                        if (round === 1) {
                            let completeArcHeight = circle1y - circle8y;
                            //console.log('arc takes up = ' + completeArcHeight);
                            let spaceOtherThanCompleteArc = fullRectHeight - completeArcHeight;

                            //console.log('pick start height index = ' + pickStartHeight);
                            if (pickStartHeight === 0) {
                                arcStartFromBottom = 1*spaceOtherThanCompleteArc / 10;
                            }
                            else if (pickStartHeight === 1) {
                                arcStartFromBottom = spaceOtherThanCompleteArc / 4;
                            }
                            else if (pickStartHeight === 2) {
                                arcStartFromBottom = spaceOtherThanCompleteArc / 2;
                            }
                            else if (pickStartHeight === 3) {
                                arcStartFromBottom = 3*spaceOtherThanCompleteArc / 4;
                            }
                            else if (pickStartHeight === 4) {
                                arcStartFromBottom = 9*spaceOtherThanCompleteArc / 10;
                            }
                        } else if (round === 2) {
                            // rect before arc

                            if (fillBelow) {
                                let mid56x = circle5x + .5*(circle6x - circle5x);
                                let mid56y = circle5y + .5*(circle6y - circle5y);

                                let mid43x = circle4x + .5*(circle3x - circle4x);
                                let mid43y = circle4y + .5*(circle3y - circle4y);

                                let poly1 = mycreate("polygon");
                                ans(poly1, "points",
                                    (circle7x) + "," + (circle7y) + " " +
                                    mid56x + "," + mid56y + " " +
                                    mid43x + "," + mid43y + " " +
                                    (circle1x + drawWidth1/2) + "," + (circle2y) + " " +
                                    (circle1x + drawWidth1/2) + "," + (fullRectHeight+tmargin) + " " +
                                    circle7x + "," + (fullRectHeight+tmargin) + " " +
                                "");
                                ans(poly1, "stroke", primaryColor);
                                ans(poly1, FILL, primaryColor);
                                ans(poly1, "stroke-width", "2");
                                ans(poly1, "fill-opacity", fillOpacity);
                                ans(poly1, "filter", "url(#noise)")
                                ac(drawingLevelSvg, poly1);


                                // figure out cut lines that will cut neighbors to create balance
                                // TODO: draw lines from the arc that extend until the end of the screen. where they intersect rect start/end become
                                // TODO: options for cutoffs

                                // line 45
                                // get slope
                                let slope45 = (circle5y - circle4y) / (circle5x - circle4x);

                                // find y coordinate when x is left edge of canvas
                                // y = mx + b
                                // b = y - slope45*x
                                let b45 = circle4y - slope45*circle4x;

                                // y = slope45*lmargin + b45
                                let interyleft = slope45*lmargin + b45;
                                //mycircle(lmargin, interyleft, 6, "#000000", drawingLevelSvg);

                                // find y coordinate when x is right edge of canvas
                                let interyright = slope45*(wunits-rmargin) + b45;
                                //mycircle(wunits-rmargin, interyright, 6, "#000000", drawingLevelSvg);
                                // draw line between those 2 points

                                // find y coordinate when x is right edge of this arcs right rect
                                let interyrect = slope45*(circle7x) + b45;
                                //mycircle(circle7x, interyrect, 6, "000000", drawingLevelSvg);

                                // find line eq that goes other way based on previous point
                                let inverseslope45 = -slope45;
                                let inverseb45 = interyrect - inverseslope45*circle7x;

                                let inverseyleft = inverseslope45*lmargin + inverseb45;
                                //mycircle(lmargin, inverseyleft, 6, "#000000", drawingLevelSvg);

                                let inverseyright = inverseslope45*(wunits-rmargin) + inverseb45;
                                //mycircle(wunits-rmargin, inverseyright, 6, "000000", drawingLevelSvg);

                                // line 36

                            } else if (fillAbove) {
                                let mid56x = circle5x + .5*(circle6x - circle5x);
                                let mid56y = circle5y + .5*(circle6y - circle5y);

                                let mid43x = circle4x + .5*(circle3x - circle4x);
                                let mid43y = circle4y + .5*(circle3y - circle4y);

                                let poly1 = mycreate("polygon");
                                ans(poly1, "points",
                                    (circle1x) + "," + (circle1y) + " " +
                                    mid43x + "," + mid43y + " " +
                                    mid56x + "," + mid56y + " " +
                                    (circle8x + drawWidth1/2) + "," + (circle8y) + " " +
                                    (circle8x + drawWidth1/2) + "," + (tmargin) + " " +
                                    circle1x + "," + (tmargin) + " " +
                                    "");
                                ans(poly1, "stroke", primaryColor);
                                ans(poly1, FILL, primaryColor);
                                ans(poly1, "stroke-width", "2");
                                ans(poly1, "fill-opacity", fillOpacity);
                                ans(poly1, "filter", "url(#noise)")
                                ac(drawingLevelSvg, poly1);
                            }

                            // turning
                            //mycircle(myturning1x, myturning1y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                            let buffer = 4;
                            myrect(startx, fullRectHeight + tmargin - arcStartFromBottom - buffer, drawWidth1, arcStartFromBottom + buffer, primaryColor, null, drawingLevelSvg);

                            // first arc
                            let offset = 0;
                            let arc1 = mycreate("path");
                            ans(arc1, "d", "M " + (circle2x + offset) + " " + (circle2y + offset) + " " +
                                "A " + turningCircleRadius + " " + turningCircleRadius + " 0 0 1 " + (circle3x + offset) + " " + (circle3y + offset) + " " +
                                "L " + (circle4x + offset) + " " + (circle4y + offset) + " " +
                                "A " + largeArcRadius + " " + largeArcRadius + " 0 0 0 " + (circle1x + offset) + " " + (circle1y + offset) + " " +
                                "Z");
                            ans(arc1, "stroke", primaryColor);
                            ans(arc1, FILL, primaryColor);
                            ans(arc1, "stroke-width", "2");
                            ans(arc1, "fill-opacity", fillOpacity);
                            //ans(arc1, "filter", "url(#noisearc)")
                            //ac(drawingLevelSvg, arc1);

                            // TODO: experiment w drawing arc w small rects

                            let numArcDivs = 10;
                            // 45 degrees / 5
                            let angleOffset = (Math.PI / 4) / numArcDivs;

                            let dwsplit = 4;

                            let miniRectHeight = Math.PI*turningCircleRadius*(1/4)*(1/numArcDivs);
                            for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                                for (let a = 0; a < (Math.PI / 4); a += angleOffset/2) {
                                    let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                                    let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);

                                    let pegx = myturning1x + 4.5 - xoff;
                                    let pegy = myturning1y + 4.5 - yoff;
                                    //mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);


                                    let thirdAngle = degrees(Math.PI / 2 - a);

                                    // draw a small rect at each dot
                                    myrect(pegx, pegy, drawWidth1 / dwsplit-1, miniRectHeight, primaryColor,
                                        "rotate(" + (270 - thirdAngle) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                                    // rotate the rect the correct amount so that it is tangent to the curcl
                                }
                            }

                            let yoff = (turningCircleRadius) * Math.sin(Math.PI/4);
                            let xoff = (turningCircleRadius) * Math.cos(Math.PI/4);

                            let pegx = myturning1x + 4.5 - xoff;
                            let pegy = myturning1y + 4.5 - yoff;

                            // new diag rect logic
                            myrect(pegx, pegy, drawWidth1, diagRectHeight, primaryColor,
                                "rotate(" + (270 -45) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                            // diag rect
                            // myrect(circle3x, circle3y, drawWidth1, diagRectHeight, primaryColor,
                            //     "rotate(-135 " + (circle3x+2) + " " + (circle3y+2) + ")", drawingLevelSvg);

                            // rect after arc
                            let arc2 = mycreate("path");
                            ans(arc2, "d", "M " + circle6x + " " + circle6y + " " +
                                "A " + largeArcRadius + " " + largeArcRadius + " 0 0 0 " + circle7x + " " + circle7y + " " +
                                "L " + circle8x + " " + circle8y + " " +
                                "A " + turningCircleRadius + " " + turningCircleRadius + " 0 0 1 " + circle5x + " " + circle5y + " " +
                                "Z");
                            ans(arc2, "stroke", primaryColor);
                            ans(arc2, FILL, primaryColor);
                            ans(arc2, "stroke-width", "0");
                            //ans(arc2, "filter", "url(#noisearc)")
                            ans(arc2, "stroke-width", "2");
                            ans(arc2, "fill-opacity", fillOpacity);
                            //ans(arc2, "filter", "url(#noisearc)")
                            //ac(drawingLevelSvg, arc2);

                            //mycircle(turning2x, turning2y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                            // TODO: experiment w drawing arc #2 w small rects

                            for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                                for (let a = 0; a < (Math.PI / 4); a += angleOffset/2) {
                                    let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                                    let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);

                                    let pegx = turning2x + xoff;
                                    let pegy = turning2y + yoff;
                                    //mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);


                                    let thirdAngle = degrees(Math.PI / 2 - a);

                                    // draw a small rect at each dot
                                    myrect(pegx, pegy, drawWidth1 / dwsplit-1, miniRectHeight, primaryColor,
                                        "rotate(" + (90 - thirdAngle) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);
                                    // myrect(pegx, pegy, .95*drawWidth1 / dwsplit, miniRectHeight, primaryColor,
                                    //     null, drawingLevelSvg);

                                    // rotate the rect the correct amount so that it is tangent to the curcl
                                }
                                //break;
                            }

                            // final rect
                            myrect(startSecondRect, tmargin, drawWidth1, circle8y - tmargin + buffer, primaryColor, null, drawingLevelSvg);

                        }
                    }

                } else {
                    // console.log('draw up down!');

                    let arcStartFromTop = 0;

                    for (let round = 1; round <= 2; round++) {

                        // 4 points for first turn
                        let circle1x = startx;
                        let circle1y = tmargin + arcStartFromTop;
                        //mycircle(circle1X, circle1Y, 6, "#000000", drawingLevelSvg);

                        let circle2x = startx + drawWidth1;
                        let circle2y = tmargin + arcStartFromTop;
                        //mycircle(circle2X, circle2Y, 6, "#000000", drawingLevelSvg);

                        let turning1x = startx + drawWidth1 + turningCircleRadius;
                        let turning1y = tmargin + arcStartFromTop;
                        //mycircle(turning1x, turning1y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                        let circle3x = startx + drawWidth1 + turningCircleRadius - turningCircleRadius * sin45;
                        let circle3y = tmargin + arcStartFromTop + turningCircleRadius * cos45;
                        //mycircle(circle3X, circle3Y, 6, "#000000", drawingLevelSvg);

                        let largeArcRadius = turningCircleRadius + drawWidth1;
                        let circle4x = startx + drawWidth1 + turningCircleRadius - largeArcRadius * sin45;
                        let circle4y = tmargin + arcStartFromTop + largeArcRadius * cos45;
                        //mycircle(circle4X, circle4Y, 6, "#000000", drawingLevelSvg);

                        // diagonal rect
                        let xdiff = circle4x - circle1x;
                        let dotx = startSecondRect + drawWidth1 - xdiff;

                        // y = mx + b
                        // y = x + c3y - c3x
                        let intery = 1 * dotx + circle3y - circle3x;
                        //console.log('inter y = ' + intery);

                        let circle6x = dotx;
                        let circle6y = intery;

                        // distance from circle 3 to intersection point. that is the rectangle height
                        let diagRectHeight = dist(circle3x, circle3y, circle6x, circle6y);
                        // //console.log('diag rect height = ' + diagRectHeight);

                        //mycircle(circle6x, circle6y, 6, "#00ff00", drawingLevelSvg);

                        let circle5x = circle6x - cos45 * drawWidth1;
                        let circle5y = circle6y + sin45 * drawWidth1;
                        //mycircle(circle5x, circle5y, 6, "#0000ff", drawingLevelSvg);

                        let turning2x = circle5x - turningCircleRadius * cos45;
                        let turning2y = circle5y + turningCircleRadius * sin45;

                        //mycircle(turning2x, turning2y, turningCircleRadius, "#ffffff", drawingLevelSvg);
                        //
                        let diagRectOffset = 0;//4;
                        // myrect(circle4X + .5 * diagRectOffset, circle4Y + 1.5 * diagRectOffset, drawWidth1, diagRectHeight + diagRectOffset, primaryColor,
                        //      "rotate(-45 " + (circle4X + .5 * diagRectOffset) + " " + (circle4Y + 1.5 * diagRectOffset) + ")", drawingLevelSvg);


                        // 4 points for final turn
                        let circle8x = startSecondRect;
                        let circle8y = turning2y;
                        //mycircle(circle8x, circle8y, 6, '#00ffff', drawingLevelSvg);

                        let circle7x = startSecondRect + drawWidth1;
                        let circle7y = turning2y;
                        //mycircle(circle7x, circle7y, 6, '#000000', drawingLevelSvg);

                        // figure out arc start point
                        if (round === 1) {
                            let completeArcHeight = circle8y - circle1y;
                            let spaceOtherThanCompleteArc = fullRectHeight - completeArcHeight;

                            // DEBUG
                            //let pickStartHeight = rint(0,5);
                            //console.log('pick start height index = ' + pickStartHeight);
                            if (pickStartHeight === 4) {
                                arcStartFromTop = 1*spaceOtherThanCompleteArc / 10;
                            }
                            else if (pickStartHeight === 3) {
                                arcStartFromTop = spaceOtherThanCompleteArc / 4;
                            }
                            else if (pickStartHeight === 2) {
                                arcStartFromTop = spaceOtherThanCompleteArc / 2;
                            }
                            else if (pickStartHeight === 1) {
                                arcStartFromTop = 3*spaceOtherThanCompleteArc / 4;
                            } else if (pickStartHeight === 0) {
                                arcStartFromTop = 9*spaceOtherThanCompleteArc / 10;
                            }

                        } else if (round === 2) {

                            if (fillBelow) {
                                let mid56x = circle5x + .5*(circle6x - circle5x);
                                let mid56y = circle6y + .5*(circle5y - circle6y);

                                let mid43x = circle4x + .5*(circle3x - circle4x);
                                let mid43y = circle3y + .5*(circle4y - circle3y);

                                let poly1 = mycreate("polygon");
                                ans(poly1, "points",
                                    (circle1x) + "," + (circle1y) + " " +
                                    mid43x + "," + mid43y + " " +
                                    mid56x + "," + mid56y + " " +
                                    (circle8x + drawWidth1/2) + "," + (circle8y) + " " +
                                    (circle8x + drawWidth1/2) + "," + (fullRectHeight+tmargin) + " " +
                                    circle1x + "," + (fullRectHeight+tmargin) + " " +
                                    "");
                                ans(poly1, "stroke", primaryColor);
                                ans(poly1, FILL, primaryColor);
                                ans(poly1, "stroke-width", "2");
                                ans(poly1, "fill-opacity", fillOpacity);
                                ans(poly1, "filter", "url(#noise)")
                                ac(drawingLevelSvg, poly1);
                            } else if (fillAbove) {

                                let mid56x = circle5x + .5*(circle6x - circle5x);
                                let mid56y = circle6y + .5*(circle5y - circle6y);

                                let mid43x = circle4x + .5*(circle3x - circle4x);
                                let mid43y = circle3y + .5*(circle4y - circle3y);

                                let poly1 = mycreate("polygon");
                                ans(poly1, "points",
                                    (circle7x) + "," + (circle7y) + " " +
                                    mid56x + "," + mid56y + " " +
                                    mid43x + "," + mid43y + " " +
                                    (circle1x + drawWidth1/2) + "," + (circle2y) + " " +
                                    (circle1x + drawWidth1/2) + "," + (tmargin) + " " +
                                    circle7x + "," + (tmargin) + " " +
                                    "");
                                ans(poly1, "stroke", primaryColor);
                                ans(poly1, FILL, primaryColor);
                                ans(poly1, "stroke-width", "2");
                                ans(poly1, "fill-opacity", fillOpacity);
                                ans(poly1, "filter", "url(#noise)")
                                ac(drawingLevelSvg, poly1);
                            }


                            // draw all shapes here

                            // turning
                            //mycircle(turning1x, turning1y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                            // first rect
                            myrect(startx, tmargin, drawWidth1, arcStartFromTop + 4, primaryColor, null, drawingLevelSvg);

                            // first arc
                            let offset = 0;
                            // let arc1 = mycreate("path");
                            // ans(arc1, "d", "M " + (circle2x + offset) + " " + (circle2y + offset) + " " +
                            //     "A " + turningCircleRadius + " " + turningCircleRadius + " 0 0 0 " + (circle3x + offset) + " " + (circle3y + offset) + " " +
                            //     "L " + (circle4x + offset) + " " + (circle4y + offset) + " " +
                            //     "A " + largeArcRadius + " " + largeArcRadius + " 0 0 1 " + (circle1x + offset) + " " + (circle1y + offset) + " " +
                            //     "Z");
                            // ans(arc1, "stroke", primaryColor);
                            // ans(arc1, FILL, primaryColor);
                            // ans(arc1, "stroke-width", "2");
                            // ans(arc1, "fill-opacity", fillOpacity);
                            // ans(arc1, "filter", "url(#noisearc)")
                            // //ac(drawingLevelSvg, arc1);

                            // experiment w drawing arc w small rects

                            let numArcDivs = 10;
                            // 45 degrees / 5
                            let angleOffset = (Math.PI / 4) / numArcDivs;

                            let dwsplit = 4;

                            let miniRectHeight = Math.PI*turningCircleRadius*(1/4)*(1/numArcDivs);
                            let miniRectWidth = drawWidth1 / dwsplit-1;

                            // for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                            //     for (let a = 0; a < (Math.PI / 4); a += angleOffset/2) {
                            //         let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                            //         let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);
                            //
                            //         let pegx = turning1x - xoff;
                            //         let pegy = turning1y + yoff;
                            //         mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);
                            //
                            //
                            //         let thirdAngle = degrees(Math.PI / 2 - a);
                            //
                            //         //console.log('third angle = ' + thirdAngle);
                            //
                            //         // draw a small rect at each dot
                            //         // myrect(pegx, pegy, drawWidth1 / dwsplit-1, miniRectHeight, primaryColor,
                            //         //     "rotate(" + (270 - thirdAngle) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);
                            //
                            //         myrect(pegx-miniRectWidth, pegy, miniRectWidth, miniRectHeight, primaryColor,
                            //             "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);
                            //
                            //         // rotate the rect the correct amount so that it is tangent to the curcl
                            //     }
                            // }

                            for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                                for (let a = (Math.PI / 4); a >= 0; a -= angleOffset/2) {
                                    let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                                    let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);

                                    let pegx = turning1x - xoff;
                                    let pegy = turning1y + yoff;
                                    //mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);


                                    let thirdAngle = degrees(Math.PI / 2 - a);

                                    //console.log('third angle = ' + thirdAngle);

                                    // draw a small rect at each dot
                                    // myrect(pegx, pegy, drawWidth1 / dwsplit-1, miniRectHeight, primaryColor,
                                    //     "rotate(" + (270 - thirdAngle) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                                    myrect(pegx-miniRectWidth, pegy, miniRectWidth, miniRectHeight, primaryColor,
                                        "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                                    // rotate the rect the correct amount so that it is tangent to the curcl
                                }
                            }

                            // new diag rect (up to down)
                            let yoff = (turningCircleRadius) * Math.sin(Math.PI/4);
                            let xoff = (turningCircleRadius) * Math.cos(Math.PI/4);

                            let pegx = turning1x - xoff;
                            let pegy = turning1y + yoff;

                            // new diag rect logic
                            myrect(pegx-drawWidth1, pegy, drawWidth1, diagRectHeight +  4, primaryColor,
                                "rotate(" + (-1*(90-45)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                            // diagonal rect
                            // myrect(circle4x - 4, circle4y - 2, drawWidth1, diagRectHeight + 10, primaryColor,
                            //     "rotate(-45 " + (circle4x - 4) + " " + (circle4y - 2) + ")", drawingLevelSvg);

                            // second arc
                            // let arc2 = mycreate("path");
                            // ans(arc2, "d", "M " + circle6x + " " + circle6y + " " +
                            //     "A " + largeArcRadius + " " + largeArcRadius + " 0 0 1 " + circle7x + " " + circle7y + " " +
                            //     "L " + circle8x + " " + circle8y + " " +
                            //     "A " + turningCircleRadius + " " + turningCircleRadius + " 0 0 0 " + circle5x + " " + circle5y + " " +
                            //     "Z");
                            // ans(arc2, "stroke", primaryColor);
                            // ans(arc2, FILL, primaryColor);
                            // ans(arc2, "stroke-width", "0");
                            // //ans(arc2, "filter", "url(#noisearc)")
                            // ans(arc2, "stroke-width", "2");
                            // ans(arc2, "fill-opacity", fillOpacity);
                            // ans(arc2, "filter", "url(#noisearc)")
                            // // ac(drawingLevelSvg, arc2);

                            // turning 2
                            //mycircle(turning2x, turning2y, turningCircleRadius, "#ffffff", drawingLevelSvg);

                            // for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                            //     for (let a = Math.PI/4; a > 0; a -= angleOffset/2) {
                            //         let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                            //         let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);
                            //
                            //         let pegx = turning2x + xoff;
                            //         let pegy = turning2y - yoff;
                            //         //mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);
                            //
                            //
                            //         let thirdAngle = degrees(Math.PI / 2 - a);
                            //
                            //         //console.log('third angle = ' + thirdAngle);
                            //
                            //         // draw a small rect at each dot
                            //         // myrect(pegx-miniRectWidth, pegy, miniRectWidth, miniRectHeight, primaryColor,
                            //         //     "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);
                            //
                            //         myrect(pegx, pegy, miniRectWidth, miniRectHeight, primaryColor,
                            //             "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);
                            //
                            //         // rotate the rect the correct amount so that it is tangent to the curcl
                            //     }
                            //     //break;
                            // }

                            for (let mult = 0; mult < dwsplit - .5; mult += .5) {
                                for (let a = 0; a <= Math.PI/4; a += angleOffset/2) {
                                    let yoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.sin(a);
                                    let xoff = (mult*drawWidth1/dwsplit + turningCircleRadius) * Math.cos(a);

                                    let pegx = turning2x + xoff;
                                    let pegy = turning2y - yoff;
                                    //mycircle(pegx, pegy, 3, "#000000", drawingLevelSvg);


                                    let thirdAngle = degrees(Math.PI / 2 - a);

                                    //console.log('third angle = ' + thirdAngle);

                                    // draw a small rect at each dot
                                    // myrect(pegx-miniRectWidth, pegy, miniRectWidth, miniRectHeight, primaryColor,
                                    //     "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                                    myrect(pegx, pegy, miniRectWidth, miniRectHeight, primaryColor,
                                        "rotate(" + (-1*(90-thirdAngle)) + " " + (pegx) + " " + (pegy) + ")", drawingLevelSvg);

                                    // rotate the rect the correct amount so that it is tangent to the curcl
                                }
                                //break;
                            }

                            // final rect
                            myrect(startSecondRect, circle8y - 4, drawWidth1, tmargin + fullRectHeight - circle8y + 4, primaryColor, null, drawingLevelSvg);
                        }
                    }
                }
                return horizontalDrawWidth;
            }

            function betterDraw(rects, startx, round) {
                // iterate over newRects
                // if it's a number that's easy, draw it
                // if it's an array, check 1st element to see what it is - arc or pattern
                // can be recursive, like a group can have just numbers, or can have arcs, or any mix of numbers and arcs

                //let startx = lmargin;

                let horizontalDrawWidth = 0;


                for (let i = 0; i < rects.length; i++) {
                    //console.log('next element = ' + rects[i]);
                    //console.log('next element is array = ' + Array.isArray(rects[i]));

                    //let innerstartx = 0;

                    if (Array.isArray(rects[i])) {
                        let type = rects[i][0];
                        if (type === 'group') {
                            //console.log('found a group array');
                            let hdw = betterDraw(rects[i], startx, round);
                            hdw -= colGap;
                            startx += hdw;
                        } else if (type.startsWith('arc')) {
                            //console.log('found a arc array');
                            let hdw = drawCurvedPath(rects[i], startx, round === 1);
                            //hdw -= colGap;
                            startx += hdw;
                        }
                    } else if (rects[i] === 'group') {
                        //console.log('inside group array');
                        continue;
                    } else {
                        let absWidth = Math.abs(rects[i]);
                        let drawWidth = absWidth * colWidth + colGap * (absWidth - 1);

                        if (rects[i] > 0 && round === 2) {
                            //console.log('\trect width in units = ' + rects[i]);
                            myrect(startx, tmargin, drawWidth, fullRectHeight, primaryColor, null, drawingLevelSvg);
                            // if (absWidth >= 4 && od(0.5)) {
                            //     myrect(startx + drawWidth/2, tmargin + fullRectHeight/4, drawWidth/2, fullRectHeight/2, PRIMARY_COLOR_A, null, drawingLevelSvg);
                            // }
                        }
                        horizontalDrawWidth += drawWidth;
                        horizontalDrawWidth += colGap;

                        startx += drawWidth;
                    }

                    startx += colGap;
                }

                return horizontalDrawWidth;
            }

            betterDraw(newRects, lmargin, 1);
            betterDraw(newRects, lmargin, 2);

            let curveNames = {'111':'Narrow', '121':'Wide'};
            let curvesMix = [];
            let linesMix = [];
            let numFills = 0;
            let numCurves = 0;
            let leftBorder = false;
            let rightBorder = false;
            // get stats
            for (let i = 0; i < newRects.length; i++) {
                let working = newRects[i];
                if (isArc(working)) {
                    numCurves++;

                    let attr = getArcAttributes(working[0]);
                    if (attr.shouldFill) {
                        numFills++;
                    }

                    let curveConfig = [];
                    for (let j = 1; j < working.length; j++) {
                        curveConfig.push(working[j]);
                    }
                    let digitsName = curveConfig.join('');
                    let curveName = curveNames[digitsName];
                    if (!curveName) {
                        curveName = digitsName;
                    }
                    if (!curvesMix.includes(curveName)) {
                        curvesMix.push(curveName);
                    }

                    let arcDigit = working[1];
                    if (!linesMix.includes(arcDigit)) {
                        linesMix.push(arcDigit);
                    }
                } else {
                    // not arc, means it's just a line/rect

                    if (i === 0) {
                        leftBorder = true;
                    } else if (i === (newRects.length - 1)) {
                        rightBorder = true;
                    }

                    if (!linesMix.includes(working)) {
                        linesMix.push(working);
                    }
                }
            }

            curvesMix.sort();

            linesMix.sort(function(a, b) {
                return a - b;
            });

            function getBorderString(l,r) {
                if (l && r) {
                    return 'Left and Right';
                }
                if (l && !r) {
                    return 'Left Only';
                }
                if (!l && r) {
                    return 'Right Only';
                }
                if (!l && !r) {
                    return 'None';
                }
                return 'Unknown';
            }

            function getLineMixString(lm) {
                if (lm.length === 1) {
                    return lm[0] + 's Only';
                }

                if (lm.length === 2) {
                    return lm[0] + 's and ' + lm[1] + 's';
                }

                if (lm.length === 3) {
                    return lm[0] + 's, ' + lm[1] + 's, and ' + lm[2] + 's';
                }

                return lm.join(',');
            }

            let options = {
                'Number of Curves': numCurves,
                'Curves Mix': curvesMix.length === 1? curvesMix[0] : (curvesMix.join(' and ')),
                'Number of Fills': numFills,
                'Border': getBorderString(leftBorder, rightBorder),
                'Line Mix': getLineMixString(linesMix),
                'Color': primaryColorObj.name
            }

            //console.log(JSON.stringify(options));

            window.$fxhashFeatures = {
                ...options
            }

            // raza draw logic

            return ac(topLevelSvg, drawingLevelSvg), topLevelSvg
        })().outerHTML;
        let MY_BLOB = new Blob([SVG_XML], {
            type: "image/svg+xml"
        });
        let objectUrl = (window.URL || window.webkitURL || window).createObjectURL(MY_BLOB);
        let MY_IMAGE = new Image;
        MY_IMAGE.onload = () => {
            let a = canvasElement.getContext("2d");
            a.drawImage(MY_IMAGE, 0, 0, canvasWidth, canvasHeight), setTimeout((function () {
                ((e, a) => {
                    disableGrain || (e => {
                        const a = e.getImageData(0, 0, canvasWidth, canvasHeight),
                            n = a.data;
                        e.putImageData(a, 0, 0)
                    })(e), fxpreview()
                })(a)
            }), 1), document.body.addEventListener("keypress", (function (t) {
                if ("s" == t.key && (e.download = `${fxhash}.svg`, e.href = objectUrl, e.click()), "p" == t.key) {
                    let a = canvasElement.toDataURL("image/png");
                    e.download = `${fxhash}.png`, e.href = a, e.click()
                }
            }))
        };
        MY_IMAGE.src = objectUrl
    }))
})();
