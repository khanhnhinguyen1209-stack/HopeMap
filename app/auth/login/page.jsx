// app/(auth)/login/page.jsx
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/hooks/useAuth';
import { showToast } from '@/components/core/Toast';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async ({ email, password }) => {
        const submitBtn = document.getElementById('loginSubmitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Đang đăng nhập...';

        const result = await login(email, password);

        submitBtn.disabled = false;
        submitBtn.textContent = 'Đăng nhập';

        if (result.success) {
            showToast('Đăng nhập thành công!', 'success');
            // Chuyển hướng đến trang chính sau khi đăng nhập thành công
            router.push('/main/map');
        } else {
            showToast('Đăng nhập thất bại. Vui lòng kiểm tra email và mật khẩu.', 'error');
        }
    };

    return (
        <div className="login-screen">
            <div className="login-container">
                <div className="login-card">
                    <h1 className="login-title">🗺️ Hope Map</h1>
                    <p className="login-subtitle">Đăng nhập để tiếp tục</p>
                    <LoginForm onSubmit={handleLogin} />
                    
                    <div className="login-divider"><span>HOẶC</span></div>
                    
                    <button className="btn-google" onClick={() => {
                        // Mock Google Login (tương tự như login form, nhưng chỉ cần gọi login với mock data)
                        handleLogin({ email: 'google@user.com', password: 'mockpassword' });
                    }}>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg> Đăng nhập bằng Google 
                    </button>
                    
                    <p className="login-footer">Bằng cách đăng nhập, bạn đồng ý với điều khoản sử dụng của Hope Map</p>
                    
                    <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ color: '#666', marginBottom: '10px' }}>Chưa có tài khoản?</p>
                        <button className="btn-register" onClick={() => router.push('/register')}>Đăng ký ngay</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
