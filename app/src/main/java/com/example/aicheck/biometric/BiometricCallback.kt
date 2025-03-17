package com.example.aicheck.biometric

interface BiometricCallback {
    fun onBiometricSuccess()
    fun onBiometricFailure(errorMessage: String)
}
