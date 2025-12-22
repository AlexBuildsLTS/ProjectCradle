import { supabase } from '../utils/supabase';

/**
 * PROJECT CRADLE: ATTACHMENT ACADEMY API
 * Path: src/api/academy.ts
 */
export const academyApi = {
  /**
   * Fetches all courses available for the user's tier.
   */
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('category', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Fetches detailed lessons for a specific curriculum.
   */
  async getLessons(courseId: string) {
    const { data, error } = await supabase
      .from('lessons')
      .select('*, user_progress(*)')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Marks a biometric lesson as "Mastered".
   */
  async completeLesson(lessonId: string) {
    const { data: { user } } = await supabase.auth.getUser();
    const { error } = await supabase
      .from('user_progress')
      .insert({ user_id: user?.id, lesson_id: lessonId });

    if (error) throw error;
  }
};