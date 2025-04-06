package com.aicheck.batch.domain.report.presentation;

import com.aicheck.batch.domain.report.application.ReportScheduler;
import com.aicheck.batch.domain.report.application.ReportService;
import com.aicheck.batch.domain.report.presentation.dto.MonthlyPeerReportResponse;
import com.aicheck.batch.domain.report.presentation.dto.MonthlyReportResponse;
import com.aicheck.batch.global.auth.annotation.CurrentMemberId;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reports")
public class ReportController {

    private final ReportScheduler reportScheduler;
    private final ReportService reportService;

    // 리포트 생성용 임시 컨트롤러
    @GetMapping("/test")
    public String test() {
        List<?> records = reportScheduler.collectMonthlyTransactionStatistics();
        return "@@@";
    }

    @GetMapping
    public ResponseEntity<MonthlyReportResponse> getReport(@RequestParam Integer year,
                                                           @RequestParam Integer month,
                                                           @RequestParam Long childId) {
        return ResponseEntity.ok(reportService.findMonthlyReport(childId, year, month));
    }

    @GetMapping("/my")
    public ResponseEntity<MonthlyReportResponse> getMyReport(@RequestParam Integer year,
                                                             @RequestParam Integer month,
                                                             @CurrentMemberId Long childId) {
        return ResponseEntity.ok(reportService.findMonthlyReport(childId, year, month));
    }

    @GetMapping("/peer")
    public ResponseEntity<MonthlyPeerReportResponse> getPeerReport(@RequestParam Integer year,
                                                                   @RequestParam Integer month,
                                                                   @RequestParam Long childId) {
        return ResponseEntity.ok(reportService.findMonthlyPeerReport(childId, year, month));
    }

    @GetMapping("/peer/my")
    public ResponseEntity<MonthlyPeerReportResponse> getMyPeerReport(@RequestParam Integer year,
                                                                     @RequestParam Integer month,
                                                                     @CurrentMemberId Long childId) {
        return ResponseEntity.ok(reportService.findMonthlyPeerReport(childId, year, month));
    }

}
