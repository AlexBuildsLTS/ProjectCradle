import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BookOpen, Clock, PlayCircle, Star, ChevronRight } from 'lucide-react-native';
import { academyApi } from '../../src/api/academy';
import { BlurView } from 'expo-blur';

export default function AcademyScreen() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    academyApi.getCourses().then(setCourses);
  }, []);

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      {/* Academy Header */}
      <View className="pt-16 px-8 pb-8 border-b border-white/40 bg-white/20">
        <Text className="text-slate-400 font-black uppercase text-[10px] tracking-[3px] mb-1">Cradle Academy</Text>
        <Text className="text-slate-800 text-4xl font-black tracking-tighter">Attachment Parenting</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        {/* Featured Insight Card */}
        <View className="bg-mint-400 p-8 rounded-[50px] mb-10 shadow-xl shadow-mint-100 flex-row items-center overflow-hidden">
           <View className="flex-1">
             <Text className="text-white font-black text-2xl tracking-tight mb-2">Master the SweetSpot®</Text>
             <Text className="text-white/80 font-medium leading-5 mb-4">Our most popular science-based course on awake windows.</Text>
             <TouchableOpacity className="bg-white/20 self-start px-5 py-2.5 rounded-full border border-white/30">
               <Text className="text-white font-bold text-xs uppercase">Resume Lesson</Text>
             </TouchableOpacity>
           </View>
           <Star color="white" size={60} strokeWidth={1} className="opacity-30 absolute right-[-10]" />
        </View>

        <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-6 ml-2">Curriculum library</Text>

        {courses.map((course) => (
          <TouchableOpacity 
            key={course.id}
            className="bg-white/40 border border-white rounded-[45px] mb-6 overflow-hidden shadow-sm"
          >
            <View className="flex-row p-6">
              <View className="w-24 h-24 bg-sky-100 rounded-3xl items-center justify-center mr-6 border border-sky-50 shadow-inner">
                <BookOpen size={32} color="#0284c7" />
              </View>
              <View className="flex-1 justify-center">
                <View className="flex-row items-center mb-1">
                   <View className="bg-mint-100 px-2 py-0.5 rounded-md mr-2">
                     <Text className="text-mint-600 text-[9px] font-black uppercase">{course.category || 'Expert'}</Text>
                   </View>
                </View>
                <Text className="text-slate-700 text-xl font-black tracking-tight">{course.title}</Text>
                <View className="flex-row items-center mt-2 gap-4">
                  <View className="flex-row items-center">
                    <Clock size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-[10px] font-bold ml-1 uppercase">45m</Text>
                  </View>
                  <View className="flex-row items-center">
                    <PlayCircle size={12} color="#94a3b8" />
                    <Text className="text-slate-400 text-[10px] font-bold ml-1 uppercase">6 Lessons</Text>
                  </View>
                </View>
              </View>
              <ChevronRight color="#cbd5e1" className="self-center" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}