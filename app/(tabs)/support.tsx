import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { Lock, Send, LifeBuoy, ChevronRight, MessageSquare, Trash2 } from 'lucide-react-native';
import { useAuthStore } from '../../src/store/auth/useAuthStore';
import { supportApi } from '../../src/api/support';

export default function SupportHub() {
  const { role, profile } = useAuthStore();
  const [view, setView] = useState<'LIST' | 'TICKET' | 'FAQ'>('LIST');
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [reply, setReply] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const data = await supportApi.getUserTickets();
    setTickets(data);
  };

  const handleReply = async () => {
    if (!reply.trim()) return;
    await supportApi.addComment(selectedTicket.id, reply, isInternal);
    setReply('');
    fetchTickets(); // Refresh thread
  };

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      {/* Header Mesh */}
      <View className="pt-16 px-6 pb-6 border-b border-white/40 bg-white/20">
        <Text className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mb-1">Cradle Support</Text>
        <Text className="text-slate-700 text-3xl font-black">{view === 'LIST' ? 'Assistance' : 'Discussion'}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {view === 'LIST' ? (
          <>
            <TouchableOpacity onPress={() => setView('FAQ')} className="bg-mint-400 p-6 rounded-[35px] mb-6 shadow-lg shadow-mint-100 flex-row justify-between items-center">
              <View className="flex-row items-center">
                <LifeBuoy color="white" size={24} />
                <Text className="text-white font-bold ml-4 text-lg">Browse FAQ</Text>
              </View>
              <ChevronRight color="white" size={20} />
            </TouchableOpacity>

            <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest mb-4 ml-2">Active Tickets</Text>
            {tickets.map(t => (
              <TouchableOpacity key={t.id} onPress={() => { setSelectedTicket(t); setView('TICKET'); }} 
                className="bg-white/40 border border-white p-6 rounded-[35px] mb-4 shadow-sm flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-slate-700 font-bold text-lg">{t.subject}</Text>
                  <View className="flex-row items-center mt-1">
                    <View className={`w-2 h-2 rounded-full mr-2 ${t.status === 'OPEN' ? 'bg-mint-400' : 'bg-slate-300'}`} />
                    <Text className="text-slate-400 font-bold text-xs uppercase">{t.status}</Text>
                  </View>
                </View>
                <ChevronRight color="#cbd5e1" size={20} />
              </TouchableOpacity>
            ))}
          </>
        ) : (
          /* THREADED DISCUSSION VIEW (Referencing image_751343.png) */
          <View>
            <TouchableOpacity onPress={() => setView('LIST')} className="mb-6"><Text className="text-mint-500 font-bold">← Back to List</Text></TouchableOpacity>
            
            {selectedTicket.support_comments?.map((c: any) => (
              <View key={c.id} className={`p-5 rounded-[25px] mb-4 border ${c.is_internal ? 'bg-amber-50/50 border-amber-200' : 'bg-white/60 border-white'}`}>
                {c.is_internal && (
                  <View className="flex-row items-center mb-2">
                    <Lock size={12} color="#b45309" />
                    <Text className="text-amber-700 text-[10px] font-black uppercase ml-1">Internal Staff Note</Text>
                  </View>
                )}
                <Text className="text-slate-600 leading-6">{c.comment_body}</Text>
              </View>
            ))}

            {/* Response Input */}
            <BlurView intensity={60} className="mt-6 p-6 rounded-[40px] border border-white bg-white/40">
              {(role === 'ADMIN' || role === 'SUPPORT') && (
                <TouchableOpacity onPress={() => setIsInternal(!isInternal)} className={`mb-4 self-start px-3 py-1.5 rounded-full border ${isInternal ? 'bg-amber-100 border-amber-300' : 'bg-white border-slate-200'}`}>
                   <Text className="text-[10px] font-black uppercase">{isInternal ? '📝 Internal Mode' : '🌍 Public Reply'}</Text>
                </TouchableOpacity>
              )}
              <TextInput 
                className="text-slate-700 mb-4 min-h-[80px]" 
                placeholder="Type your reply..." 
                multiline
                value={reply}
                onChangeText={setReply}
              />
              <TouchableOpacity onPress={handleReply} className="bg-sky-400 h-14 rounded-full items-center justify-center shadow-lg">
                <Text className="text-white font-black">Send Response</Text>
              </TouchableOpacity>
            </BlurView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}