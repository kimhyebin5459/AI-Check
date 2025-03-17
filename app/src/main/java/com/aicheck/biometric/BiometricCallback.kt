package com.aicheck.biometric

interface BiometricCallback {
    fun onBiometricSuccess()
    fun onBiometricFailure(errorMessage: String)
}
