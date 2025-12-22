import { BlurView } from "expo-blur";
import { Baby, Clock, Droplet, Moon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { supabase } from "../../src/utils/supabase";

export default function HistoricalLogs() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase
        .from("care_events")
        .select("*")
        .order("timestamp", { ascending: false })
        .limit(100);
      setLogs(data || []);
    };
    fetchLogs();
  }, []);

  const LogIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "SLEEP":
        return <Moon size={20} color="#0ea5e9" />;
      case "FEED":
        return <Droplet size={20} color="#10B981" />;
      default:
        return <Baby size={20} color="#f59e0b" />;
    }
  };

  return (
    <View className="flex-1 bg-[#F0F9FF]">
      <View className="pt-16 px-8 pb-6 border-b border-white/20">
        <Text className="text-slate-400 font-black uppercase text-[10px] tracking-widest">
          Biometric Ledger
        </Text>
        <Text className="text-slate-800 text-3xl font-black">History</Text>
      </View>

      <FlatList
        data={logs}
        contentContainerStyle={{ padding: 24 }}
        renderItem={({ item }) => (
          <BlurView
            intensity={40}
            tint="light"
            className="mb-4 p-5 rounded-[35px] border border-white bg-white/30 flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white rounded-2xl items-center justify-center shadow-sm mr-4">
                <LogIcon type={item.event_type} />
              </View>
              <View>
                <Text className="text-slate-700 font-bold text-lg">
                  {item.event_type}
                </Text>
                <View className="flex-row items-center">
                  <Clock size={12} color="#94a3b8" />
                  <Text className="text-slate-400 text-xs font-medium ml-1">
                    {new Date(item.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </View>
              </View>
            </View>
            <Text className="text-slate-400 font-black text-xs uppercase">
              {item.metadata?.amount_ml ? `${item.metadata.amount_ml}ml` : ""}
            </Text>
          </BlurView>
        )}
      />
    </View>
  );
}
