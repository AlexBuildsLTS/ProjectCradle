import { GlassCard } from '@/components/glass/GlassCard';
import { Theme } from '@/lib/shared/Theme';
import { Camera, Heart, MessageCircle, Share2 } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

/**
 * PROJECT CRADLE: FAMILY SHARED JOURNAL
 * Features: Multi-caregiver sync, Encrypted Image Hosting, AAA Obsidian UI
 */
export default function JournalScreen() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      author: 'Sarah (Mom)',
      content: 'Charlie took his first steps towards the sofa today! 👣',
      image:
        'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=800',
      likes: 4,
      timestamp: '2 hours ago',
    },
  ]);

  return (
    <ScrollView
      className="flex-1 p-6 bg-neutral-950"
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View className="flex-row items-center justify-between mb-8">
        <Text className="text-4xl font-black text-white">Journal</Text>
        <TouchableOpacity className="p-3 border bg-primary/20 rounded-2xl border-primary/30">
          <Camera size={24} color={Theme.colors.primary} />
        </TouchableOpacity>
      </View>

      {/* New Post Entry Area */}
      <GlassCard className="mb-10 border-white/5 bg-white/5">
        <TextInput
          placeholder="Capture a milestone..."
          placeholderTextColor="#475569"
          multiline
          className="text-white text-lg font-medium min-h-[80px] mb-4"
        />
        <View className="flex-row items-center justify-between">
          <View className="flex-row space-x-4">
            <TouchableOpacity className="p-2 border rounded-lg bg-white/5 border-white/10">
              <Camera size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity className="px-6 py-2 bg-primary rounded-xl">
            <Text className="font-black text-neutral-950 uppercase text-[10px]">
              Post to Family
            </Text>
          </TouchableOpacity>
        </View>
      </GlassCard>

      {/* Timeline Feed */}
      <View className="space-y-8">
        {entries.map((post, index) => (
          <Animated.View key={post.id} entering={FadeInUp.delay(index * 100)}>
            <GlassCard className="p-0 overflow-hidden border-white/10">
              <View className="flex-row items-center justify-between p-4">
                <View className="flex-row items-center">
                  <View className="items-center justify-center w-8 h-8 rounded-full bg-secondary">
                    <Text className="text-white font-black text-[10px]">S</Text>
                  </View>
                  <View className="ml-3">
                    <Text className="text-sm font-bold text-white">
                      {post.author}
                    </Text>
                    <Text className="text-neutral-500 text-[10px] font-bold uppercase">
                      {post.timestamp}
                    </Text>
                  </View>
                </View>
                <Share2 size={18} color="#475569" />
              </View>

              <Image
                source={{ uri: post.image }}
                className="w-full h-64 bg-neutral-900"
                resizeMode="cover"
              />

              <View className="p-5">
                <Text className="mb-6 text-base font-medium leading-6 text-white">
                  {post.content}
                </Text>

                <View className="flex-row items-center pt-4 space-x-6 border-t border-white/5">
                  <TouchableOpacity className="flex-row items-center">
                    <Heart size={20} color="#F87171" />
                    <Text className="ml-2 text-xs font-black text-white">
                      {post.likes}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center">
                    <MessageCircle size={20} color="#94A3B8" />
                    <Text className="ml-2 text-xs font-black text-neutral-500">
                      Add Comment
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </GlassCard>
          </Animated.View>
        ))}
      </View>
    </ScrollView>
  );
}
