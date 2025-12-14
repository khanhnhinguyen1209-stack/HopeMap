// app/(main)/register-service/page.jsx
'use client';
import React, { useState } from 'react';
import { defaultConfig } from '@/lib/constants';
import { showToast } from '@/components/core/Toast';
import RegisterServiceForm from '@/components/RegisterServiceForm'; // Form component

export default function RegisterServicePage() {
    const [currentType, setCurrentType] = useState('volunteer');

    const handleRegister = (formData) => {
        // Mock submission
        return new Promise((resolve) => {
            setTimeout(() => {
                showToast(`Đăng ký "${currentType}" thành công! Chúng tôi sẽ liên hệ với bạn sớm.`, 'success');
                // Ở đây, bạn sẽ gửi formData đến API route thực tế
                resolve({ success: true });
            }, 1500);
        });
    };

    return (
        <section id="register-section" className="section active">
            <div className="card">
                <h2 id="registerTitle">{defaultConfig.register_title}</h2>
                <p>Chọn loại dịch vụ bạn muốn đăng ký</p>

                <div className="register-type-selector">
                    <button 
                        className={`register-type-btn ${currentType === 'volunteer' ? 'active' : ''}`} 
                        onClick={() => setCurrentType('volunteer')}
                        data-type="volunteer"> 
                        🌱 Tình nguyện viên 
                    </button>
                    <button 
                        className={`register-type-btn ${currentType === 'help' ? 'active' : ''}`} 
                        onClick={() => setCurrentType('help')}
                        data-type="help"> 
                        🆘 Cần giúp đỡ 
                    </button>
                    <button 
                        className={`register-type-btn ${currentType === 'support' ? 'active' : ''}`} 
                        onClick={() => setCurrentType('support')}
                        data-type="support"> 
                        💬 Nhắn tin hỗ trợ 
                    </button>
                </div>
                
                <RegisterServiceForm type={currentType} onSubmit={handleRegister} />
            </div>
        </section>
    );
}