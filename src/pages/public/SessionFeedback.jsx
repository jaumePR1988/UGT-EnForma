import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Star, Send, CheckCircle, MessageSquare } from 'lucide-react';
import { feedbackService } from '../../services/feedbackService';
import { Button } from '../../components/ui/Button';
import { courseService } from '../../services/courseService';

const SessionFeedback = () => {
    const { sessionId } = useParams();
    const [searchParams] = useSearchParams();
    const courseId = searchParams.get('c');

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [course, setCourse] = useState(null);

    useEffect(() => {
        if (courseId) {
            loadCourseInfo();
        }
    }, [courseId]);

    const loadCourseInfo = async () => {
        try {
            const courseData = await courseService.getCourseById(courseId);
            setCourse(courseData);
        } catch (err) {
            console.error("Error loading course:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Si us plau, selecciona una puntuació.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await feedbackService.submitFeedback({
                courseId,
                sessionId,
                rating,
                comment,
                type: 'session'
            });
            setSubmitted(true);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-xl text-center space-y-6 animate-in fade-in zoom-in duration-300">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={40} className="text-green-600" />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900">Gràcies!</h2>
                    <p className="text-slate-600">
                        La teva valoració s'ha enviat correctament. La teva opinió ens ajuda a millorar.
                    </p>
                    <div className="pt-4">
                        <p className="text-sm text-slate-400">Ja pots tancar aquesta pestanya.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="h-2 bg-blue-600 w-full"></div>

                <div className="p-8 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-black text-slate-900 mb-2">Valoració de la Sessió</h1>
                        {course && (
                            <p className="text-blue-600 font-medium text-sm px-4 py-1 bg-blue-50 rounded-full inline-block">
                                {course.name}
                            </p>
                        )}
                        <p className="text-slate-500 text-sm mt-4">
                            Com valoraries l'experiència a la classe d'avui?
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => { setRating(star); setError(''); }}
                                        className={`transition-all duration-200 transform hover:scale-110 focus:outline-none ${rating >= star ? 'text-amber-400' : 'text-slate-200 hover:text-amber-200'
                                            }`}
                                    >
                                        <Star size={42} fill={rating >= star ? "currentColor" : "none"} strokeWidth={1.5} />
                                    </button>
                                ))}
                            </div>
                            <div className="text-sm font-medium text-slate-400 min-h-[20px]">
                                {rating === 1 && "Molt millorable"}
                                {rating === 2 && "Just"}
                                {rating === 3 && "Bé"}
                                {rating === 4 && "Molt bé"}
                                {rating === 5 && "Excel·lent!"}
                            </div>
                        </div>

                        {/* Comment */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                <MessageSquare size={16} />
                                Comentari (Opcional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Què t'ha semblat la sessió? Algun suggeriment?"
                                className="w-full p-4 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder:text-slate-400 text-slate-700 resize-none h-32"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <Button
                            type="submit"
                            disabled={loading || rating === 0}
                            fullWidth
                            className={`h-12 text-lg font-bold shadow-lg shadow-blue-500/30 ${loading ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? 'Enviant...' : (
                                <span className="flex items-center gap-2">
                                    Enviar Valoració <Send size={18} />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="text-center pt-4 border-t border-slate-100">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            UGT EnForma
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionFeedback;
