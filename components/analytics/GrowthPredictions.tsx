import { GlassCard } from '@/components/glass/GlassCard';
import { Calendar, Sparkles } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Badge } from '../ui/Badge';

export const GrowthPredictions = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const getAIPrediction = async () => {
    setLoading(true);
    // Simulation logic handshakes with berry-growth-advisor
    setTimeout(() => {
      setPrediction(
        'Trajectory indicates a 6-month weight target of 8.2kg (75th Percentile).',
      );
      setLoading(false);
    }, 1000);
  };

  return (
    <View style={{ marginTop: 32 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingHorizontal: 4,
        }}
      >
        <Text
          style={{
            color: '#475569',
            fontWeight: '900',
            fontSize: 10,
            letterSpacing: 2,
          }}
        >
          FUTURE PROJECTIONS
        </Text>
        <Badge label="AI ACTIVE" variant="secondary" />
      </View>

      <GlassCard
        style={{
          borderColor: 'rgba(183, 148, 246, 0.2)',
          backgroundColor: 'rgba(183, 148, 246, 0.05)',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <Sparkles size={20} color="#B794F6" />
          <Text
            style={{
              marginLeft: 12,
              fontSize: 11,
              fontWeight: '900',
              color: '#B794F6',
              letterSpacing: 1,
            }}
          >
            6-MONTH FORECAST
          </Text>
        </View>

        {prediction ? (
          <Animated.View entering={FadeInDown}>
            <Text
              style={{
                color: '#FFF',
                fontSize: 16,
                fontWeight: '700',
                lineHeight: 24,
                marginBottom: 16,
              }}
            >
              {prediction}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={14} color="#475569" />
              <Text
                style={{
                  marginLeft: 6,
                  fontSize: 9,
                  fontWeight: '900',
                  color: '#475569',
                }}
              >
                NEXT CHECKUP: FEB 12
              </Text>
            </View>
          </Animated.View>
        ) : (
          <TouchableOpacity
            onPress={getAIPrediction}
            disabled={loading}
            style={{
              height: 56,
              borderRadius: 16,
              backgroundColor: 'rgba(183, 148, 246, 0.1)',
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: 'rgba(183, 148, 246, 0.2)',
            }}
          >
            {loading ? (
              <ActivityIndicator color="#B794F6" />
            ) : (
              <Text
                style={{
                  color: '#B794F6',
                  fontWeight: '900',
                  fontSize: 11,
                  letterSpacing: 1,
                }}
              >
                GENERATE BIOMETRIC FORECAST
              </Text>
            )}
          </TouchableOpacity>
        )}
      </GlassCard>
    </View>
  );
};
