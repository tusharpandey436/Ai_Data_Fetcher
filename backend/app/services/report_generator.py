from app.utils.logger import get_logger
from typing import List, Dict
import os
import json
from datetime import datetime

logger = get_logger()

# Store last generated report
_last_report = None


class ReportGeneratorService:

    def generate_report(self, report_name: str, records: List[Dict]):
        """
        Generate structured report
        """

        global _last_report

        try:

            logger.info(f"Generating report: {report_name}")

            report = {
                "report_name": report_name,
                "total_records": len(records),
                "records": records
            }

            # Store report in memory (existing feature)
            _last_report = report

            # -----------------------------
            # Save report as JSON file
            # -----------------------------
            try:

                reports_dir = "reports"
                os.makedirs(reports_dir, exist_ok=True)

                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

                file_path = os.path.join(
                    reports_dir,
                    f"{report_name}_{timestamp}.json"
                )

                with open(file_path, "w") as f:
                    json.dump(report, f, indent=4)

                logger.info(f"Report saved to {file_path}")

            except Exception as e:

                logger.error(f"Failed to save report file: {str(e)}")

            logger.info("Report generated successfully")

            return report

        except Exception as e:

            logger.error(f"Report generation failed: {str(e)}")

            return {
                "error": str(e)
            }


def get_last_report():
    """
    Return last generated report
    """

    global _last_report

    if _last_report is None:

        return {
            "message": "No report generated yet"
        }

    return _last_report


# Singleton instance
report_generator_service = ReportGeneratorService()