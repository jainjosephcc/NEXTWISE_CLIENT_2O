<template>
  <div
      ref="chartContainer"
      class="candlestick-bg absolute inset-0 w-full h-full pointer-events-none z-0"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue'

const chartContainer = ref(null);

const sampleCandles = [
  { time: 1687843200, open: 100, high: 110, low: 90, close: 105 },
  { time: 1687929600, open: 105, high: 118, low: 101, close: 111 },
  { time: 1688016000, open: 111, high: 125, low: 108, close: 120 },
  { time: 1688102400, open: 120, high: 130, low: 117, close: 128 },
  { time: 1688188800, open: 128, high: 135, low: 125, close: 127 },
  { time: 1688275200, open: 127, high: 132, low: 123, close: 130 },
  { time: 1688361600, open: 130, high: 140, low: 129, close: 138 },
  { time: 1688448000, open: 138, high: 145, low: 135, close: 140 },
  { time: 1688534400, open: 140, high: 148, low: 139, close: 147 },
  { time: 1688620800, open: 147, high: 155, low: 145, close: 153 },
];

onMounted(() => {
  // Use the global LightweightCharts from CDN
  const { createChart } = window.LightweightCharts;

  if (!chartContainer.value) return;

  const chart = createChart(chartContainer.value, {
    width: chartContainer.value.offsetWidth,
    height: chartContainer.value.offsetHeight,
    layout: {
      background: { type: 'solid', color: 'transparent' },
      textColor: '#aaa'
    },
    grid: { vertLines: { visible: false }, horzLines: { visible: false } },
    timeScale: { visible: false, borderVisible: false },
    rightPriceScale: { visible: false },
    leftPriceScale: { visible: false },
    crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
    handleScroll: false,
    handleScale: false,
  });

  const candleSeries = chart.addCandlestickSeries({
    upColor: '#18c37d',
    downColor: '#ff5860',
    borderVisible: false,
    wickUpColor: '#18c37d',
    wickDownColor: '#ff5860',
  });

  // Start with sample data
  let history = [...sampleCandles];
  candleSeries.setData(history);

  // Animate: shift in new candles to create a scrolling effect
  setInterval(() => {
    // Generate a new candle (random walk style)
    const last = history[history.length - 1];
    const base = last.close;
    const open = base + (Math.random() - 0.5) * 4;
    const close = open + (Math.random() - 0.5) * 8;
    const high = Math.max(open, close) + Math.random() * 3;
    const low = Math.min(open, close) - Math.random() * 3;
    const time = last.time + 86400;

    const newCandle = {
      time,
      open: Math.round(open * 100) / 100,
      close: Math.round(close * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
    };

    history.push(newCandle);
    history.shift(); // Remove oldest
    candleSeries.setData([...history]);
  }, 900);

  // Resize on window resize
  window.addEventListener('resize', () => {
    chart.applyOptions({
      width: chartContainer.value.offsetWidth,
      height: chartContainer.value.offsetHeight,
    });
  });
});
</script>

<style scoped>
.candlestick-bg {
  z-index: 0;
  opacity: 0.18;
  filter: blur(2px) brightness(0.9);
  transition: opacity 0.4s;
}
</style>
