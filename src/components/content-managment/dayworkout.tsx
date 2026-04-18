"use client" ;
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { icons } from "lucide-react";
import ICONS from '@/assets/icons';
import DrawerModal from '@/components/DrawerModal';
import WorkoutService from '@/services/workoutService';
import { buildBaseDailyWorkoutPayload, buildCompleteDailyWorkoutPayload, buildExercisesPayload } from '@/utils/workoutPayloadBuilder';
import { BaseDailyWorkoutPayload, CompleteDailyWorkoutPayload } from '@/types/workoutPayload';
import { errorToast, successToast } from '@/lib/toasts';

interface AlternateMovement {
  name: string;
  description: string;
  stepByStepGuide: string;
  modificationNotes: string;
}

interface Exercise {
  name: string;
  description: string;
  sets: number;
  reps: number;
  stepByStepGuide: string;
  alternateMovements: AlternateMovement[];
}

interface DailyWorkout {
  _id?: string;
  workoutId: string;
  week: number;
  day: string;
  workoutType: string;
  description: string;
  workoutDescription: string;
  isRestDay: boolean;
  exercises?: Exercise[];
}

export default function DayWorkout() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workoutId = searchParams.get('workoutId');
  const week = parseInt(searchParams.get('week') || '1');
  const day = searchParams.get('day') || 'MONDAY';
  const restDayParam = searchParams.get('restDay');
  
  const [workoutType, setWorkoutType] = useState("");
  const [description, setDescription] = useState("");
  const [isRestDay, setIsRestDay] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDailyWorkout, setExistingDailyWorkout] = useState<DailyWorkout | null>(null);
  // Remove the hardcoded workouts array
  // const [workouts, setWorkouts] = useState([    { id: 1, name: "Push-Ups", sets: 4, reps: 25, image: "/assets/icons/videosvg.svg" }

  // ]);

  // Exercises state
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExerciseIndex, setEditingExerciseIndex] = useState<number | null>(null);

  // Initialize isRestDay from query param on first render
  useEffect(() => {
    if (restDayParam !== null) {
      setIsRestDay(restDayParam === 'true');
    }
  // run only once on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch existing daily workout data
  useEffect(() => {
    const fetchExistingDailyWorkout = async () => {
      if (!workoutId) return;

      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://inlbqls1kk.execute-api.us-west-1.amazonaws.com/dev/api/v1'}/daily-workouts?workoutId=${workoutId}&week=${week}&day=${day}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data.length > 0) {
            const existingWorkout = data.data[0];
            setExistingDailyWorkout(existingWorkout);
            setWorkoutType(existingWorkout.workoutType || '');
            setDescription(existingWorkout.workoutDescription || '');
            setIsRestDay(existingWorkout.isRestDay || false);
            setExercises(existingWorkout.exercises || []);
          }
        }
      } catch (error) {
        console.error('Error fetching existing daily workout:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExistingDailyWorkout();
  }, [workoutId, week, day]);

  // Function to convert HTML to plain text
  const htmlToPlainText = (html: string): string => {
    if (!html) return '';
    // Remove HTML tags and decode HTML entities
    return html
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
      .replace(/&amp;/g, '&') // Replace &amp; with &
      .replace(/&lt;/g, '<') // Replace &lt; with <
      .replace(/&gt;/g, '>') // Replace &gt; with >
      .replace(/&quot;/g, '"') // Replace &quot; with "
      .replace(/&#39;/g, "'") // Replace &#39; with '
      .trim();
  };

  // Handle save daily workout
  const handleSaveDailyWorkout = async () => {
    if (!workoutId) {
      setError('No workout ID provided');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const basePayload: BaseDailyWorkoutPayload = buildBaseDailyWorkoutPayload({
        workoutId,
        week,
        day,
        workoutType,
        description,
        isRestDay,
      });

      const exercisesPayload = buildExercisesPayload(exercises);
      const fullPayload: CompleteDailyWorkoutPayload = buildCompleteDailyWorkoutPayload(basePayload, exercisesPayload);

      let result;
      const hasExercises = exercises.length > 0;

      if (existingDailyWorkout?._id && hasExercises) {
        // Update existing daily workout with exercises
        result = await WorkoutService.updateCompleteDailyWorkout(existingDailyWorkout._id, fullPayload);
      } else if (existingDailyWorkout?._id && !hasExercises) {
        // No dedicated non-complete update endpoint; fallback to creating or treat as complete without exercises
        result = await WorkoutService.updateCompleteDailyWorkout(existingDailyWorkout._id, basePayload);
      } else if (hasExercises) {
        // Create new daily workout with exercises
        result = await WorkoutService.createCompleteDailyWorkout(fullPayload);
      } else {
        // Create new daily workout without exercises
        result = await WorkoutService.createDailyWorkout(basePayload);
      }

      if (result.success) {
        alert('Daily workout saved successfully!');
        const responseWorkoutId = result.data?.dailyWorkout?.workoutId || result.data?.workoutId || workoutId;
        router.push(`/content-management/workoutdetails?workoutId=${responseWorkoutId}&week=${week}`);
      } else {
        setError(result.message || 'Failed to save daily workout');
      }
    } catch (error) {
      console.error('Error saving daily workout:', error);
      setError('Failed to save daily workout');
    } finally {
      setLoading(false);
    }
  };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalFields, setModalFields] = useState({
    name: '',
    oneline: '',
    sets: '',
    reps: '',
    guide: '',
  });
  const [modalMovements, setModalMovements] = useState<AlternateMovement[]>([]);
  const [modalVideo, setModalVideo] = useState<File | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);
  const [altAltModalOpen, setAltAltModalOpen] = useState(false);
  const [altAltFields, setAltAltFields] = useState({
    name: '',
    oneline: '',
    guide: '',
    notes: '',
  });
  const [editingAlternateIndex, setEditingAlternateIndex] = useState<number | null>(null);
  const [altVideo, setAltVideo] = useState<File | null>(null);
  const altVideoInputRef = useRef<HTMLInputElement | null>(null);



  // Add this function to handle adding an exercise
  const handleEditExercise = (index: number) => {
    const exercise = exercises[index];
    setModalFields({
      name: exercise.name,
      oneline: exercise.description,
      sets: exercise.sets.toString(),
      reps: exercise.reps.toString(),
      guide: exercise.stepByStepGuide,
    });
    setModalMovements(exercise.alternateMovements);
    setEditingExerciseIndex(index);
    setDrawerOpen(true);
  };

  // Update the handleAddExercise function to handle both add and edit
  const handleAddExercise = () => {
    const newExercise: Exercise = {
      name: modalFields.name,
      description: modalFields.oneline,
      sets: Number(modalFields.sets),
      reps: Number(modalFields.reps),
      stepByStepGuide: modalFields.guide,
      alternateMovements: modalMovements,
    };

    if (editingExerciseIndex !== null) {
      // Edit existing exercise
      setExercises((prev: Exercise[]) => {
        const updated = [...prev];
        updated[editingExerciseIndex] = newExercise;
        return updated;
      });
      setEditingExerciseIndex(null);
    } else {
      // Add new exercise
      setExercises((prev: Exercise[]) => [...prev, newExercise]);
    }

    setDrawerOpen(false);
    setModalFields({ name: '', oneline: '', sets: '', reps: '', guide: '' });
    setModalMovements([]);
    setModalVideo(null);
  };

  // Update the modal close handler to reset edit state
  const handleCloseModal = () => {
    setDrawerOpen(false);
    setEditingExerciseIndex(null);
    setModalFields({ name: '', oneline: '', sets: '', reps: '', guide: '' });
    setModalMovements([]);
    setModalVideo(null);
  };

  // Add this function to handle editing an alternate movement
  const handleEditAlternateMovement = (index: number) => {
    const alternate = modalMovements[index];
    setAltAltFields({
      name: alternate.name,
      oneline: alternate.description,
      guide: alternate.stepByStepGuide,
      notes: alternate.modificationNotes,
    });
    setEditingAlternateIndex(index);
    setAltAltModalOpen(true);
  };

  // Update the handleAddAlternateMovement function to handle both add and edit
  const handleAddAlternateMovement = () => {
    const newAlt: AlternateMovement = {
      name: altAltFields.name,
      description: altAltFields.oneline,
      stepByStepGuide: altAltFields.guide,
      modificationNotes: altAltFields.notes,
    };

    if (editingAlternateIndex !== null) {
      // Edit existing alternate movement
      setModalMovements((prev: AlternateMovement[]) => {
        const updated = [...prev];
        updated[editingAlternateIndex] = newAlt;
        return updated;
      });
      setEditingAlternateIndex(null);
    } else {
      // Add new alternate movement
      setModalMovements((prev: AlternateMovement[]) => [...prev, newAlt]);
    }

    setAltAltModalOpen(false);
    setAltAltFields({ name: '', oneline: '', guide: '', notes: '' });
  };

  // Update the alternate movement modal close handler
  const handleCloseAlternateModal = () => {
    setAltAltModalOpen(false);
    setEditingAlternateIndex(null);
    setAltAltFields({ name: '', oneline: '', guide: '', notes: '' });
    setAltVideo(null);
  };
  return (
    <div >
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
        {/* Left Card */}
        <div className="bg-white rounded-lg shadow-sm border p-3 flex flex-col gap-2 h-[700px] lg:h-[700px]">
        <span className="font-adelle text-[25px] font-medium text-gray-800 pt-4 pb-3">
          {day === 'MONDAY' ? 'Monday' : 
           day === 'TUESDAY' ? 'Tuesday' : 
           day === 'WEDNESDAY' ? 'Wednesday' : 
           day === 'THURSDAY' ? 'Thursday' : 
           day === 'FRIDAY' ? 'Friday' : 
           day === 'SATURDAY' ? 'Saturday' : 
           day === 'SUNDAY' ? 'Sunday' : 'Monday'} - Week {week}
        </span>
        <div>
            <label className="font-adelle text-[17px] font-medium text-gray-800 pt-4 ">Workout type / Targeted body parts</label>
            <input
              className="w-full px-3 py-4 border  rounded-[7px] p-2  pt-3 text-sm "
              placeholder="Write here..."
              value={workoutType}
              onChange={e => setWorkoutType(e.target.value)}
            />
          </div>
          <div>
            <label className="font-adelle text-[17px] font-medium text-gray-800 pt-4 ">Description</label>
            <RichTextEditor
              content={description}
              onChange={val => setDescription(val)}
              placeholder="Write here..."
              onImageUpload={undefined}
              minHeight="80px"
              className="py-2"
            />
          </div>
          <div className="flex items-center border border-gray-200 rounded-[7px] px-5 py-6 bg-white">
            <img src="/assets/icons/bedpick.svg" alt="Rest day" className="w-5 h-5 mr-2" />
            <span className="text-gray-700 font-medium flex-1">Mark as rest day</span>
            <label className="inline-flex items-center cursor-pointer ml-2">
              <input type="checkbox" className="sr-only peer" checked={isRestDay} onChange={() => setIsRestDay(v => !v)} />
              <div className="w-10 h-6 bg-gray-100 rounded-[5px] peer peer-checked:bg-lightBrown transition-colors relative">
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isRestDay ? 'translate-x-4' : ''}`}></div>
              </div>
            </label>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}
          
          {/* Remove the Save Daily Workout button from left panel */}
        </div>
        {/* Right Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 flex flex-col gap-4 h-auto lg:h-[700px]">
          <h2 className="font-adelle text-[25px] font-medium text-gray-800  ">Workouts</h2>
          <div>
            <label className="font-adelle text-[17px] font-medium text-gray-800 pt-4 ">description</label>
            <RichTextEditor
              content={description}
              onChange={val => setDescription(val)}
              placeholder="Write here..."
              onImageUpload={undefined}
              minHeight="80px"
              className="py-2"
            />
          </div>
          {/* Workouts List */}
          <div className="flex flex-col gap-2">
            {exercises.map((ex, idx) => (
              <div key={idx} className="flex items-center bg-white rounded-[5px] p-3 border border-gray-200 w-full">
                <div className="flex-1">
                  <div className="font-bold text-md text-black">{ex.name}</div>
                  <div className="text-xs text-gray-600">{ex.sets} sets × {ex.reps} reps</div>
                </div>
                <button 
                  className="ml-2 p-1 flex items-center"
                  onClick={() => handleEditExercise(idx)}
                >
                  <img src={ICONS.pencil} alt="pencil" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          {/* Add Button */}
          <button className="w-full border border-black rounded-[5px] p-3 flex items-center justify-center hover:bg-gray-50" onClick={() => setDrawerOpen(true)}>
            <img src={ICONS.plus} alt="plus" className="w-6 h-6" />
          </button>
          <DrawerModal open={drawerOpen} onClose={handleCloseModal} widthClassName="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
            <div className="flex flex-col gap-4 p-4 sm:p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-adelle text-2xl font-bold text-black">
                  {editingExerciseIndex !== null ? 'Edit Workout' : 'Add Workout'}
                </h2>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-black text-2xl">&times;</button>
              </div>
              {/* Video upload area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-80 mb-2 cursor-pointer">
                <img src={ICONS.imageveiw} alt="video" className="w-8 h-8 mb-2" />
                <span className="text-gray-500 text-sm">Tutorial video</span>
                <input ref={videoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => setModalVideo(e.target.files?.[0] || null)} />
                <button type="button" className="mt-3 rounded-[7px] bg-lightBrown w-28 h-10 flex items-center justify-center" onClick={() => videoInputRef.current?.click()}>
                  Choose video
                </button>
hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh              </div>
              {/* Name */}
              <label className="font-adelle text-[18px] font-medium text-gray-800">Name</label>
              <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={modalFields.name} onChange={e => setModalFields(f => ({...f, name: e.target.value}))} />
              {/* 1 line description */}
              <label className="font-adelle text-[18px] font-medium text-gray-800">1 line description</label>
              <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={modalFields.oneline} onChange={e => setModalFields(f => ({...f, oneline: e.target.value}))} />
              {/* Sets and Reps */}
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="font-adelle text-[18px] font-medium text-gray-800">Sets</label>
                  <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={modalFields.sets} onChange={e => setModalFields(f => ({...f, sets: e.target.value}))} />
                </div>
                <div className="flex-1">
                  <label className="font-adelle text-[18px] font-medium text-gray-800">Reps</label>
                  <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={modalFields.reps} onChange={e => setModalFields(f => ({...f, reps: e.target.value}))} />
                </div>
              </div>
              {/* Step by step guide */}
              <label className="font-adelle text-[18px] font-medium text-gray-800">Step by step guide</label>
              <RichTextEditor
                content={modalFields.guide}
                onChange={val => setModalFields(f => ({...f, guide: val}))}
                placeholder="Write here..."
                onImageUpload={undefined}
                minHeight="80px"
                className="py-2"
              />
              {/* Alternate movements */}
              <div className="flex items-center justify-between mt-2">
                <span className="font-adelle text-[16px] font-medium text-gray-800">Alternate movements</span>
                <button type="button" className="rounded-[7px] bg-lightBrown w-14 h-12 flex items-center justify-center" onClick={() => setAltAltModalOpen(true)}><img src={ICONS.plus} alt="plus" className="w-6 h-6" /></button>
              </div>
              <div className="flex flex-col gap-2">
                {modalMovements.map((w: AlternateMovement, idx: number) => (
                  <div key={idx} className="flex items-center bg-white rounded-[5px] p-2 border border-gray-200 w-full">
                    <img src={ICONS.imageveiw} alt={w.name} className="w-10 h-10 rounded object-cover mr-2" />
                    <div className="flex-1">
                      <div className="font-bold text-md text-black">{w.name}</div>
                      <div className="text-xs text-gray-600">{w.description}</div>
                    </div>
                    <button 
                      className="ml-2 p-1 flex items-center"
                      onClick={() => handleEditAlternateMovement(idx)}
                    >
                      <img src={ICONS.pencil} alt="pencil" className="w-6 h-6" />
                    </button>
                  </div>
                ))}
              </div>
              <button className="w-full bg-lightBrown text-black font-semibold py-3 rounded-[7px] mt-2" onClick={async () => {
                try {
                  const dailyId = existingDailyWorkout?._id;
                  if (!dailyId) {
                    errorToast('Save the daily workout first');
                    return;
                  }
                  // 1) Create exercise
                  const created = await WorkoutService.createExercise(dailyId, {
                    name: modalFields.name.trim(),
                    description: modalFields.oneline.trim(),
                    sets: Math.max(1, Number(modalFields.sets) || 0),
                    reps: Math.max(1, Number(modalFields.reps) || 0),
                    stepByStepGuide: modalFields.guide.trim(),
                    alternateMovements: modalMovements,
                  });
                  const exerciseId = created?.data?._id || created?._id;
                  if (!exerciseId) throw new Error('Failed to create exercise');

                  // 2) If video chosen, presign-upload-patch
                  if (modalVideo) {
                    const fileName = modalVideo.name || 'tutorial.mp4';
                    const fileType = modalVideo.type || 'video/mp4';
                    const presign = await WorkoutService.getExercisePresignedUrl(exerciseId, fileName, fileType, 'TUTORIAL_VIDEO');
                    if (!presign?.success) throw new Error('Failed to get upload URL');
                    await WorkoutService.uploadExerciseMedia(presign.data.putUrl, modalVideo);
                    await WorkoutService.updateExercise(exerciseId, { tutorialVideoUrl: presign.data.getUrl });
                  }

                  successToast('Exercise saved');
                  handleAddExercise();
                } catch (e: any) {
                  errorToast(e?.message || 'Failed to save exercise');
                }
              }}>
                {editingExerciseIndex !== null ? 'Update' : 'Save'}
              </button>
            </div>
          </DrawerModal>
          {/* Save Button */}
          {/* Single Save Button */}
          <button 
            onClick={handleSaveDailyWorkout}
            disabled={loading}
            className={`w-full bg-lightBrown text-black font-semibold py-3 rounded-[7px] mt-auto ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'hover:bg-[#f5e0c7]'
            }`}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
      <DrawerModal open={altAltModalOpen} onClose={handleCloseAlternateModal} widthClassName="w-full max-w-[400px] sm:max-w-[500px] md:max-w-[600px]">
        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-adelle text-2xl font-bold text-black">
              {editingAlternateIndex !== null ? 'Edit Alternate Movement' : 'Alternate movement'}
            </h2>
            <button onClick={handleCloseAlternateModal} className="text-gray-400 hover:text-black text-2xl">&times;</button>
          </div>
          {/* Video upload area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center h-80 mb-2 cursor-pointer">
            <img src={ICONS.imageveiw} alt="video" className="w-8 h-8 mb-2" />
            <span className="text-gray-500 text-sm">Tutorial video</span>
            <input ref={altVideoInputRef} type="file" accept="video/*" className="hidden" onChange={(e) => setAltVideo(e.target.files?.[0] || null)} />
            <button type="button" className="mt-3 rounded-[7px] bg-lightBrown w-28 h-10 flex items-center justify-center" onClick={() => altVideoInputRef.current?.click()}>
              Choose video
            </button>
          </div>
          {/* Name */}
          <label className="font-adelle text-[18px] font-medium text-gray-800">Name</label>
          <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={altAltFields.name} onChange={e => setAltAltFields(f => ({...f, name: e.target.value}))} />
          {/* 1 line description */}
          <label className="font-adelle text-[18px] font-medium text-gray-800">1 line description</label>
          <input className="w-full px-4 py-5 border border-gray-200 rounded-[7px] text-sm" placeholder="Write here..." value={altAltFields.oneline} onChange={e => setAltAltFields(f => ({...f, oneline: e.target.value}))} />
          {/* Step by step guide */}
          <label className="font-adelle text-[18px] font-medium text-gray-800">Step by step guide</label>
          <RichTextEditor
            content={altAltFields.guide}
            onChange={val => setAltAltFields(f => ({...f, guide: val}))}
            placeholder="Write here..."
            onImageUpload={undefined}
            minHeight="80px"
            className="py-2"
          />
          {/* Modification notes */}
          <label className="font-adelle text-[18px] font-medium text-gray-800">Modification notes</label>
          <RichTextEditor
            content={altAltFields.notes}
            onChange={val => setAltAltFields(f => ({...f, notes: val}))}
            placeholder="Write here..."
            onImageUpload={undefined}
            minHeight="80px"
            className="py-2"
          />
          <button className="w-full bg-lightBrown text-black font-semibold py-3 rounded-[7px] mt-2" onClick={async () => {
            try {
              const dailyId = existingDailyWorkout?._id;
              if (!dailyId) {
                errorToast('Save the daily workout first');
                return;
              }
              // 1) Create a holder exercise (or attach to a specific one if UI selects it)
              const created = await WorkoutService.createExercise(dailyId, {
                name: altAltFields.name.trim() || 'Alternate Movement',
                description: altAltFields.oneline.trim(),
                sets: 1,
                reps: 1,
                stepByStepGuide: altAltFields.guide.trim(),
                alternateMovements: [],
              });
              const exerciseId = created?.data?._id || created?._id;
              if (!exerciseId) throw new Error('Failed to create exercise');

              // 2) If video chosen, presign-upload-patch
              if (altVideo) {
                const fileName = altVideo.name || 'tutorial.mp4';
                const fileType = altVideo.type || 'video/mp4';
                const presign = await WorkoutService.getExercisePresignedUrl(exerciseId, fileName, fileType, 'TUTORIAL_VIDEO');
                if (!presign?.success) throw new Error('Failed to get upload URL');
                await WorkoutService.uploadExerciseMedia(presign.data.putUrl, altVideo);
                await WorkoutService.updateExercise(exerciseId, { alternateTutorialVideoUrl: presign.data.getUrl });
              }

              successToast('Alternate movement saved');
              handleAddAlternateMovement();
            } catch (e: any) {
              errorToast(e?.message || 'Failed to save alternate movement');
            }
          }}>
            {editingAlternateIndex !== null ? 'Update' : 'Save'}
          </button>
        </div>
      </DrawerModal>
    </div>
  );
}















