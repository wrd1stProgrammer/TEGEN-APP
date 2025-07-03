import React from 'react';
import { View } from 'react-native';
import { VictoryChart, VictoryPolarAxis, VictoryGroup, VictoryArea } from 'victory-native';

const categories = [
  '연애 성향',
  '삶 태도',
  '성격',
  '취미',
  '욕구'
];

export default function TegenRadarChart({ data }: { data: number[] }) {
  const chartData = categories.map((cat, i) => ({
    x: cat,
    y: data[i],
  }));

  return (
    <View style={{ alignItems: 'center', marginVertical: 24 }}>
      <VictoryChart
        polar
        domain={{ y: [0, 100] }}
        width={340}
        height={340}
        padding={32}
      >
        {/* Y축 (원형 그리드) */}
        <VictoryPolarAxis
          dependentAxis
          tickFormat={t => t === 100 ? '' : `${t}`}
          style={{
            axis: { stroke: '#f4f4f4' }, // 원의 테두리
            grid: { stroke: '#eaeaea', strokeDasharray: '5, 7' }, // 동글동글 연한 원
            tickLabels: { fill: '#D2A9D8', fontSize: 11, fontWeight: '600' }
          }}
          tickValues={[20, 40, 60, 80, 100]}
        />
        {/* 각 축(카테고리) 라벨 */}
        <VictoryPolarAxis
          labelPlacement="perpendicular"
          style={{
            axis: { stroke: '#eaeaea' },
            tickLabels: {
              fill: '#FFB5C5', // 귀여운 연분홍
              fontSize: 18,
              fontWeight: 'bold',
              fontFamily: 'System',
              padding: 22, // **여기가 바깥쪽으로 떨어지게 조정!**
              textShadowColor: 'rgba(255,255,255,0.7)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 4,
            },
          }}
          tickValues={categories}
        />
        <VictoryGroup color="#FF6F91">
          <VictoryArea
            data={chartData}
            style={{
              data: {
                fill: 'rgba(255,182,193,0.22)', // 더 밝고 귀여운 분홍
                stroke: '#FF6F91', // 연분홍 선
                strokeWidth: 3,
                filter: 'drop-shadow(0px 3px 10px #FFB5C5AA)',
              },
            }}
            interpolation="linear" // 더 동글동글하게
            animate={{ duration: 900, easing: 'circleIn' }}
          />
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
}
