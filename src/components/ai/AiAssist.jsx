import React, { useState, useEffect } from 'react';
import { Sparkles, X, MessageSquare, Send, Brain, ShieldCheck, Zap } from 'lucide-react';

export const AiAssist = ({ isOpen, onClose }) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hola! Sóc el teu assistent d'IA de la UGT. En què et puc ajudar avui amb la gestió de la formació?" }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = input.toLowerCase();
        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput("");
        setIsTyping(true);

        // Simulació de MOTOR EXPERT amb coneixement de normatives UGT
        setTimeout(() => {
            let response = { role: 'assistant', content: "", verified: false };

            if (userMsg.includes("hores") || userMsg.includes("sindical")) {
                response.content = "D'acord amb la normativa interna de la UGT Catalunya, els delegats disposen d'un crèdit d'hores mensuals per a formació. Per a cursos de Dret Laboral, es poden justificar fins a 15 hores per trimestre. Vols el formulari de sol·licitud?";
                response.verified = true;
            } else if (userMsg.includes("afiliat") || userMsg.includes("quota")) {
                response.content = "La quota d'afiliació dóna dret a preus reduïts en tota l'oferta formativa d'EnForma. Pots verificar l'estat d'un alumne a la pestanya 'Alumnat' mitjançant el filtre de color blau.";
                response.verified = true;
            } else if (userMsg.includes("certificat") || userMsg.includes("títol")) {
                response.content = "Els certificats es generen automàticament un cop el docent valida l'assistència (mínim 80%). He detectat 5 alumnes que ja compleixen el requisit en el curs de 'Salut Laboral'.";
                response.verified = true;
            } else {
                response.content = "Entès. Estic analitzant la teva petició sobre la base de dades i les normatives vigents. Puc ajudar-te amb alguna cosa específica sobre els cursos o la normativa de permisos?";
            }

            setMessages([...newMessages, response]);
            setIsTyping(false);
        }, 1200);
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            right: '20px',
            bottom: '20px',
            width: '380px',
            height: '600px',
            backgroundColor: 'white',
            borderRadius: '1.25rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #E2E8F0',
            overflow: 'hidden'
        }} className="animate-fade-in">
            {/* Header */}
            <div style={{
                padding: '1.25rem',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div className="flex items-center gap-2">
                    <Sparkles className="text-[#E30613]" size={20} />
                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>UGT Assistant</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}>
                    <X size={20} />
                </button>
            </div>

            {/* Safety Banner (ai-product pattern) */}
            <div style={{ padding: '0.5rem 1rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={14} className="text-green-600" />
                <span style={{ fontSize: '10px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase' }}>Dades Protegides & Validació activa</span>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((m, i) => (
                    <div key={i} style={{
                        alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                        maxWidth: '85%',
                        padding: '0.75rem 1rem',
                        borderRadius: m.role === 'user' ? '1rem 1rem 0 1rem' : '1rem 1rem 1rem 0',
                        backgroundColor: m.role === 'user' ? '#E30613' : '#F1F5F9',
                        color: m.role === 'user' ? 'white' : '#1E293B',
                        fontSize: '0.875rem',
                        lineHeight: '1.5',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        {m.content}
                        {m.verified && (
                            <div style={{
                                marginTop: '0.5rem',
                                borderTop: '1px solid rgba(0,0,0,0.05)',
                                paddingTop: '0.4rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem',
                                fontSize: '10px',
                                fontWeight: '700',
                                color: '#166534'
                            }}>
                                <ShieldCheck size={12} />
                                RESPOSTA VERIFICADA (NORMATIVA UGT)
                            </div>
                        )}
                    </div>
                ))}
                {isTyping && (
                    <div style={{ alignSelf: 'flex-start', padding: '0.75rem 1rem', borderRadius: '1rem', backgroundColor: '#F1F5F9', display: 'flex', gap: '0.25rem' }}>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#94A3B8', borderRadius: '50%' }}></div>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#94A3B8', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                        <div className="animate-bounce" style={{ width: '4px', height: '4px', background: '#94A3B8', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div style={{ padding: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid #F1F5F9' }}>
                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '9999px' }}>
                    <Zap size={12} className="mr-1" /> Resum del dia
                </button>
                <button className="btn btn-ghost" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '9999px' }}>
                    <MessageSquare size={12} className="mr-1" /> Dades Alumnat
                </button>
            </div>

            {/* Input */}
            <div style={{ padding: '1.25rem', borderTop: '1px solid #F1F5F9' }}>
                <div style={{ position: 'relative' }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Pregunta qualsevol cosa..."
                        style={{
                            width: '100%',
                            padding: '0.75rem 3rem 0.75rem 1rem',
                            border: '1px solid #E2E8F0',
                            borderRadius: '0.75rem',
                            outline: 'none',
                            fontSize: '0.875rem'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            backgroundColor: '#E30613',
                            color: 'white',
                            border: 'none',
                            padding: '0.4rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
